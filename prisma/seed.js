const { PrismaClient, ToolStatus, ActionType } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

const adminUser = { name: "Tautvydas Kasperavičius", email: "admin@statyba.lt", password: "Admin123!" };

const categories = [{ name: "Power Tools" }, { name: "Hand Tools" }, { name: "Safety Equipment" }];

const projects = [
  { code: "P2652", name: "Vilnius Business Center", location: "Vilnius" },
  { code: "P2710", name: "Kaunas Logistics Hub", location: "Kaunas" },
  { code: "P2601", name: "Klaipeda Port Expansion", location: "Klaipeda" },
  { code: "P2833", name: "Panevezys School Renovation", location: "Panevezys" },
  { code: "P2905", name: "Alytus Warehouse Upgrade", location: "Alytus" },
];

const tools = [
  { name: "Hilti Rotary Hammer TE 6-A36", inventoryNumber: "INV-1001", category: "Power Tools", conditionNotes: "Fully operational" },
  { name: "Makita Impact Driver DTD152", inventoryNumber: "INV-1002", category: "Power Tools", conditionNotes: "Battery cycle: good" },
  { name: "Bosch Angle Grinder GWS 18V", inventoryNumber: "INV-1003", category: "Power Tools", conditionNotes: "Minor guard scratches" },
  { name: "DeWalt Circular Saw DCS570", inventoryNumber: "INV-1004", category: "Power Tools", conditionNotes: "Blade replaced recently" },
  { name: "Milwaukee SDS Drill M18", inventoryNumber: "INV-1005", category: "Power Tools", conditionNotes: "Operational, extra battery included" },
  { name: "Stanley Socket Set 1/2", inventoryNumber: "INV-1006", category: "Hand Tools", conditionNotes: "Complete set" },
  { name: "Knipex Pliers Set", inventoryNumber: "INV-1007", category: "Hand Tools", conditionNotes: "Slight wear on handles" },
  { name: "Bahco Adjustable Wrench 10in", inventoryNumber: "INV-1008", category: "Hand Tools", conditionNotes: "Good condition" },
  { name: "3M Safety Helmet H-700", inventoryNumber: "INV-1009", category: "Safety Equipment", conditionNotes: "New liner installed" },
  { name: "Honeywell Full Body Harness", inventoryNumber: "INV-1010", category: "Safety Equipment", conditionNotes: "Inspection valid for 9 months" },
];

const transactionTemplates = [
  { actionType: ActionType.CHECK_OUT, note: "Issued for structural work task." },
  { actionType: ActionType.RETURN, note: "Returned to storage after shift." },
  { actionType: ActionType.REPORT_BROKEN, note: "Damage noticed on site, sent for maintenance." },
];

const employees = [
  { firstName: "Jonas", lastName: "Petrauskas" },
  { firstName: "Tomas", lastName: "Kazlauskas" },
];

function statusFromAction(action) {
  switch (action) {
    case ActionType.CHECK_OUT:
      return ToolStatus.CHECKED_OUT;
    case ActionType.RETURN:
      return ToolStatus.IN_STORAGE;
    case ActionType.REPORT_BROKEN:
      return ToolStatus.BROKEN;
    default:
      return ToolStatus.IN_STORAGE;
  }
}

async function main() {
  const passwordHash = await hash(adminUser.password, 12);
  await prisma.adminUser.upsert({
    where: { email: adminUser.email },
    update: { name: adminUser.name, password: passwordHash },
    create: { name: adminUser.name, email: adminUser.email, password: passwordHash },
  });

  const categoryIdByName = {};
  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
      select: { id: true, name: true },
    });
    categoryIdByName[savedCategory.name] = savedCategory.id;
  }

  const projectIdByCode = {};
  for (const project of projects) {
    const savedProject = await prisma.project.upsert({
      where: { code: project.code },
      update: { name: project.name, location: project.location },
      create: project,
      select: { id: true, code: true },
    });
    projectIdByCode[savedProject.code] = savedProject.id;
  }

  const toolIdByInventory = {};
  for (const tool of tools) {
    const savedTool = await prisma.tool.upsert({
      where: { inventoryNumber: tool.inventoryNumber },
      update: {
        name: tool.name,
        status: ToolStatus.IN_STORAGE,
        categoryId: categoryIdByName[tool.category],
        projectId: null,
        conditionNotes: tool.conditionNotes,
      },
      create: {
        name: tool.name,
        inventoryNumber: tool.inventoryNumber,
        qrCode: `SEED-${tool.inventoryNumber}`,
        status: ToolStatus.IN_STORAGE,
        categoryId: categoryIdByName[tool.category],
        conditionNotes: tool.conditionNotes,
      },
      select: { id: true, inventoryNumber: true },
    });

    await prisma.tool.update({
      where: { id: savedTool.id },
      data: { qrCode: `/tool/${savedTool.id}` },
    });

    toolIdByInventory[savedTool.inventoryNumber] = savedTool.id;
  }

  await prisma.toolTransaction.deleteMany();

  const projectCodes = projects.map((project) => project.code);
  const now = new Date();
  const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const transactionRows = [];
  let hourOffset = 0;

  for (let i = 0; i < tools.length; i += 1) {
    const tool = tools[i];
    for (let t = 0; t < transactionTemplates.length; t += 1) {
      const template = transactionTemplates[t];
      const employee = employees[(i + t) % employees.length];
      const projectCode = projectCodes[(i + t) % projectCodes.length];

      const createdAt = new Date(start.getTime() + hourOffset * 60 * 60 * 1000);
      hourOffset += 18;

      transactionRows.push({
        toolId: toolIdByInventory[tool.inventoryNumber],
        projectId: projectIdByCode[projectCode],
        projectCode,
        employeeFirstName: employee.firstName,
        employeeLastName: employee.lastName,
        actionType: template.actionType,
        notes: `${template.note} (${projectCode})`,
        createdAt,
      });
    }
  }

  await prisma.toolTransaction.createMany({
    data: transactionRows,
  });

  const latestByTool = new Map();
  for (const row of transactionRows) {
    const current = latestByTool.get(row.toolId);
    if (!current || row.createdAt > current.createdAt) {
      latestByTool.set(row.toolId, row);
    }
  }

  for (const [toolId, row] of latestByTool.entries()) {
    const status = statusFromAction(row.actionType);
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status,
        projectId: status === ToolStatus.CHECKED_OUT ? row.projectId : null,
      },
    });
  }

  console.log("Seed complete: 1 admin, 10 tools, 5 projects, 3 categories, 30 transactions.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

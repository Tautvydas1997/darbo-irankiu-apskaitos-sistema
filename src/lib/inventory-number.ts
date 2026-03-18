type ToolClient = {
  tool: {
    findMany: (args: { select: { inventoryNumber: true } }) => Promise<Array<{ inventoryNumber: string }>>;
  };
};

function parseInventoryNumber(value: string): number | null {
  const match = /^I(\d+)$/.exec(value.trim().toUpperCase());
  if (!match) {
    return null;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatInventoryNumber(sequence: number): string {
  return `I${String(sequence).padStart(3, "0")}`;
}

export async function getNextInventoryNumber(client: ToolClient): Promise<string> {
  const tools = await client.tool.findMany({
    select: { inventoryNumber: true },
  });

  let maxSequence = 0;
  for (const tool of tools) {
    const sequence = parseInventoryNumber(tool.inventoryNumber);
    if (sequence !== null && sequence > maxSequence) {
      maxSequence = sequence;
    }
  }

  return formatInventoryNumber(maxSequence + 1);
}

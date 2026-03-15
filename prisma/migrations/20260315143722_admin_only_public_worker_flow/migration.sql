-- CreateEnum
CREATE TYPE "ToolStatus" AS ENUM ('IN_STORAGE', 'CHECKED_OUT', 'BROKEN', 'LOST', 'IN_REPAIR');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CHECK_OUT', 'RETURN', 'REPORT_BROKEN');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'lt',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inventoryNumber" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "status" "ToolStatus" NOT NULL DEFAULT 'IN_STORAGE',
    "categoryId" TEXT NOT NULL,
    "projectId" TEXT,
    "conditionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolTransaction" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "projectId" TEXT,
    "projectCode" TEXT NOT NULL,
    "employeeFirstName" TEXT NOT NULL,
    "employeeLastName" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_code_idx" ON "Project"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_inventoryNumber_key" ON "Tool"("inventoryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_qrCode_key" ON "Tool"("qrCode");

-- CreateIndex
CREATE INDEX "Tool_inventoryNumber_idx" ON "Tool"("inventoryNumber");

-- CreateIndex
CREATE INDEX "Tool_qrCode_idx" ON "Tool"("qrCode");

-- CreateIndex
CREATE INDEX "Tool_status_idx" ON "Tool"("status");

-- CreateIndex
CREATE INDEX "Tool_categoryId_idx" ON "Tool"("categoryId");

-- CreateIndex
CREATE INDEX "Tool_projectId_idx" ON "Tool"("projectId");

-- CreateIndex
CREATE INDEX "ToolTransaction_toolId_idx" ON "ToolTransaction"("toolId");

-- CreateIndex
CREATE INDEX "ToolTransaction_projectId_idx" ON "ToolTransaction"("projectId");

-- CreateIndex
CREATE INDEX "ToolTransaction_projectCode_idx" ON "ToolTransaction"("projectCode");

-- CreateIndex
CREATE INDEX "ToolTransaction_employeeFirstName_idx" ON "ToolTransaction"("employeeFirstName");

-- CreateIndex
CREATE INDEX "ToolTransaction_employeeLastName_idx" ON "ToolTransaction"("employeeLastName");

-- CreateIndex
CREATE INDEX "ToolTransaction_actionType_idx" ON "ToolTransaction"("actionType");

-- CreateIndex
CREATE INDEX "ToolTransaction_createdAt_idx" ON "ToolTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTransaction" ADD CONSTRAINT "ToolTransaction_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTransaction" ADD CONSTRAINT "ToolTransaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

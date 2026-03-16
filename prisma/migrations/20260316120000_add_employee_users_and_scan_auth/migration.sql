-- CreateTable
CREATE TABLE "EmployeeUser" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeUser_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "ToolTransaction" ADD COLUMN "employeeUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeUser_employeeId_key" ON "EmployeeUser"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeUser_employeeId_idx" ON "EmployeeUser"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeUser_isActive_idx" ON "EmployeeUser"("isActive");

-- CreateIndex
CREATE INDEX "ToolTransaction_employeeUserId_idx" ON "ToolTransaction"("employeeUserId");

-- AddForeignKey
ALTER TABLE "ToolTransaction" ADD CONSTRAINT "ToolTransaction_employeeUserId_fkey" FOREIGN KEY ("employeeUserId") REFERENCES "EmployeeUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

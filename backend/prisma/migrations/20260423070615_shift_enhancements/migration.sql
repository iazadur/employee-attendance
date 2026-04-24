-- AlterTable
ALTER TABLE "AttendanceRecord" ADD COLUMN     "shiftEndTime" TEXT,
ADD COLUMN     "shiftGraceMinutes" INTEGER,
ADD COLUMN     "shiftId" TEXT,
ADD COLUMN     "shiftName" TEXT,
ADD COLUMN     "shiftStartTime" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Shift_name_key" ON "Shift"("name");


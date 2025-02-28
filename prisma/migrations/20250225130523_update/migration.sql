/*
  Warnings:

  - You are about to drop the column `student` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `tutor` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `Subject` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `parentDetails` on the `Tutor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tutorId,start,end]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,start,end]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_student_start_end_key";

-- DropIndex
DROP INDEX "Session_tutor_start_end_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "student",
DROP COLUMN "tutor",
ADD COLUMN     "studentId" INTEGER NOT NULL,
ADD COLUMN     "tutorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "Subject",
ALTER COLUMN "parentDetails" DROP NOT NULL,
ALTER COLUMN "fee" DROP NOT NULL,
ALTER COLUMN "currency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tutor" DROP COLUMN "parentDetails",
ADD COLUMN     "qualifications" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" INTEGER,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "userStatus" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TutorStudent" (
    "id" SERIAL NOT NULL,
    "tutorId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TutorStudent_tutorId_studentId_subject_key" ON "TutorStudent"("tutorId", "studentId", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tutorId_start_end_key" ON "Session"("tutorId", "start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "Session_studentId_start_end_key" ON "Session"("studentId", "start", "end");

-- AddForeignKey
ALTER TABLE "TutorStudent" ADD CONSTRAINT "TutorStudent_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorStudent" ADD CONSTRAINT "TutorStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

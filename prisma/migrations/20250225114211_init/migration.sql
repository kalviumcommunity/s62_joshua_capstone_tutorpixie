-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('Active', 'Discontinued', 'Paused');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('Pending', 'Confirmed', 'Cancelled', 'Ongoing', 'Completed');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userStatus" "userStatus" NOT NULL DEFAULT 'Active',
    "role" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "userId" INTEGER NOT NULL,
    "grade" TEXT,
    "subjects" TEXT[],
    "parentDetails" JSONB NOT NULL,
    "fee" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "Subject" JSONB NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "userId" INTEGER NOT NULL,
    "grades" TEXT[],
    "subjects" TEXT[],
    "parentDetails" JSONB NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "tutor" TEXT NOT NULL,
    "student" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "meetlink" TEXT,
    "status" "status" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tutor_start_end_key" ON "Session"("tutor", "start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "Session_student_start_end_key" ON "Session"("student", "start", "end");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

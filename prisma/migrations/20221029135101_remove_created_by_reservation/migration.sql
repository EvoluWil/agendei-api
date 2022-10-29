-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_createdById_fkey";

-- AlterTable
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'PENDING';

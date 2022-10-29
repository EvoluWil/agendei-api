/*
  Warnings:

  - The values [REGECTED] on the enum `enumReservationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdById` on the `reservations` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "enumReservationStatus_new" AS ENUM ('APPROVED', 'REJECTED', 'PENDING', 'CANCELED');
ALTER TABLE "reservations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reservations" ALTER COLUMN "status" TYPE "enumReservationStatus_new" USING ("status"::text::"enumReservationStatus_new");
ALTER TYPE "enumReservationStatus" RENAME TO "enumReservationStatus_old";
ALTER TYPE "enumReservationStatus_new" RENAME TO "enumReservationStatus";
DROP TYPE "enumReservationStatus_old";
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "createdById";

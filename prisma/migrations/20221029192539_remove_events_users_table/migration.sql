/*
  Warnings:

  - You are about to drop the `eventsUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "eventsUsers" DROP CONSTRAINT "eventsUsers_eventId_fkey";

-- DropForeignKey
ALTER TABLE "eventsUsers" DROP CONSTRAINT "eventsUsers_userId_fkey";

-- DropTable
DROP TABLE "eventsUsers";

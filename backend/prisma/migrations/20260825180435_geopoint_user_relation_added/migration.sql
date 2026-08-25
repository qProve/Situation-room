/*
  Warnings:

  - Added the required column `user_id` to the `GeoPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeoPoint" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GeoPoint" ADD CONSTRAINT "GeoPoint_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

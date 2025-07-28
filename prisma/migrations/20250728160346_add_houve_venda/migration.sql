/*
  Warnings:

  - Added the required column `houveVenda` to the `ResumoExecutivo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResumoExecutivo" ADD COLUMN     "houveVenda" BOOLEAN NOT NULL;

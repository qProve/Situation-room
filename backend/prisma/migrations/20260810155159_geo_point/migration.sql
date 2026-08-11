-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('TEST_POINT', 'TEST_POINT2');

-- CreateTable
CREATE TABLE "GeoPoint" (
    "id" SERIAL NOT NULL,
    "point_type" "PointType" NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "GeoPoint_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "tracking_number" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "original_price" DECIMAL(10,2);

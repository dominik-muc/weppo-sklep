-- DropForeignKey
ALTER TABLE "TransactionItem" DROP CONSTRAINT "TransactionItem_productId_fkey";

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

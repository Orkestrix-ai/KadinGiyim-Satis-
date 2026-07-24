-- ============================================================
-- RLS Setup for KadınGiyim (Supabase + NextAuth + Prisma)
-- ============================================================
-- This enables Row-Level Security on all tables and creates
-- policies based on PostgreSQL session variables set by the app:
--   app.user_id  → current user's UUID
--   app.role     → 'USER' | 'ADMIN'
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE "User"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cart"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CartItem"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Coupon"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminSetting"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dropshipper"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DropshipperProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DropshipperOrder"   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Auth tables (managed by NextAuth — service-level access)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'User'              AND policyname = 'service_all') THEN CREATE POLICY service_all ON "User"              FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Account'           AND policyname = 'service_all') THEN CREATE POLICY service_all ON "Account"           FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Session'           AND policyname = 'service_all') THEN CREATE POLICY service_all ON "Session"           FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'VerificationToken' AND policyname = 'service_all') THEN CREATE POLICY service_all ON "VerificationToken"  FOR ALL USING (true) WITH CHECK (true); END IF;
END $$;

-- ============================================================
-- Public / Admin tables
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Category'           AND policyname = 'service_all') THEN CREATE POLICY service_all ON "Category"           FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Product'            AND policyname = 'service_all') THEN CREATE POLICY service_all ON "Product"            FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ProductVariant'     AND policyname = 'service_all') THEN CREATE POLICY service_all ON "ProductVariant"     FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Coupon'             AND policyname = 'service_all') THEN CREATE POLICY service_all ON "Coupon"             FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'AdminSetting'       AND policyname = 'service_all') THEN CREATE POLICY service_all ON "AdminSetting"       FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Dropshipper'        AND policyname = 'service_all') THEN CREATE POLICY service_all ON "Dropshipper"        FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'DropshipperProduct' AND policyname = 'service_all') THEN CREATE POLICY service_all ON "DropshipperProduct" FOR ALL USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'DropshipperOrder'   AND policyname = 'service_all') THEN CREATE POLICY service_all ON "DropshipperOrder"   FOR ALL USING (true) WITH CHECK (true); END IF;
END $$;

-- ============================================================
-- User-owned tables  (Cart, CartItem, Order, OrderItem, Address)
-- ============================================================
-- user_own:  row belongs to current user
-- admin_all: admin role can see everything
-- ============================================================
DO $$
BEGIN
  -- Cart
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Cart' AND policyname = 'user_own') THEN
    CREATE POLICY user_own ON "Cart"
      FOR ALL USING ("userId" = current_setting('app.user_id', true)::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Cart' AND policyname = 'admin_all') THEN
    CREATE POLICY admin_all ON "Cart"
      FOR ALL USING (current_setting('app.role', true) = 'ADMIN');
  END IF;

  -- CartItem (owned via Cart)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CartItem' AND policyname = 'via_cart') THEN
    CREATE POLICY via_cart ON "CartItem"
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM "Cart"
          WHERE "Cart".id = "CartItem"."cartId"
          AND "Cart"."userId" = current_setting('app.user_id', true)::text
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CartItem' AND policyname = 'admin_all') THEN
    CREATE POLICY admin_all ON "CartItem"
      FOR ALL USING (current_setting('app.role', true) = 'ADMIN');
  END IF;

  -- Order
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Order' AND policyname = 'user_own') THEN
    CREATE POLICY user_own ON "Order"
      FOR ALL USING ("userId" = current_setting('app.user_id', true)::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Order' AND policyname = 'admin_all') THEN
    CREATE POLICY admin_all ON "Order"
      FOR ALL USING (current_setting('app.role', true) = 'ADMIN');
  END IF;

  -- OrderItem (owned via Order)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'OrderItem' AND policyname = 'via_order') THEN
    CREATE POLICY via_order ON "OrderItem"
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM "Order"
          WHERE "Order".id = "OrderItem"."orderId"
          AND "Order"."userId" = current_setting('app.user_id', true)::text
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'OrderItem' AND policyname = 'admin_all') THEN
    CREATE POLICY admin_all ON "OrderItem"
      FOR ALL USING (current_setting('app.role', true) = 'ADMIN');
  END IF;

  -- Address
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Address' AND policyname = 'user_own') THEN
    CREATE POLICY user_own ON "Address"
      FOR ALL USING ("userId" = current_setting('app.user_id', true)::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Address' AND policyname = 'admin_all') THEN
    CREATE POLICY admin_all ON "Address"
      FOR ALL USING (current_setting('app.role', true) = 'ADMIN');
  END IF;
END $$;

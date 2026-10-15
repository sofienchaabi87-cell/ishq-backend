-- =========================================================
-- ISHQ PARFUMS — SCRIPT D'INITIALISATION POSTGRESQL
-- Ce script SQL crée la base de données, les types, les tables
-- et insère les produits de démonstration.
-- =========================================================

-- 1. Extension UUID pour la génération automatique des identifiants
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Création des Types Énumérés (Enums)
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Table des Utilisateurs (Administrateurs & Clients)
CREATE TABLE IF NOT EXISTS "users" (
    "id" VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des Produits / Parfums
CREATE TABLE IF NOT EXISTS "products" (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "original_price" DECIMAL(10, 2),
    "category" VARCHAR(255) NOT NULL,
    "category_label" VARCHAR(255) NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "size" VARCHAR(255) NOT NULL DEFAULT '10 ml · Roll-on',
    "notes" JSONB NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "badge" VARCHAR(255),
    "stock" INT NOT NULL DEFAULT 100,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table des Commandes Clients
CREATE TABLE IF NOT EXISTS "orders" (
    "id" VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "order_number" VARCHAR(255) UNIQUE NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "customer_email" VARCHAR(255) NOT NULL,
    "customer_phone" VARCHAR(255) NOT NULL,
    "customer_city" VARCHAR(255) NOT NULL,
    "cart_total" DECIMAL(10, 2) NOT NULL,
    "shipping_cost" DECIMAL(10, 2) NOT NULL,
    "grand_total" DECIMAL(10, 2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "tracking_number" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table des Articles de Commande (Items)
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "order_id" VARCHAR(255) NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
    "product_id" VARCHAR(255) NOT NULL REFERENCES "products"("id"),
    "product_name" VARCHAR(255) NOT NULL,
    "size" VARCHAR(255) NOT NULL,
    "unit_price" DECIMAL(10, 2) NOT NULL,
    "quantity" INT NOT NULL,
    "subtotal" DECIMAL(10, 2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table des Messages de Contact
CREATE TABLE IF NOT EXISTS "contact_messages" (
    "id" VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin creation is handled by prisma/seed.ts using ADMIN_EMAIL and ADMIN_PASSWORD.
-- 8. Insertion des Parfums par Défaut dans le Catalogue
INSERT INTO "products" ("id", "name", "subtitle", "price", "category", "category_label", "image", "description", "size", "notes", "rating", "badge", "stock")
VALUES 
('ishq-signature', 'ISHQ Signature', 'Huile de Parfum Originelle', 89.00, 'signature', 'Signature', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800', 'Une composition orientale moderne où le jasmin de Grasse rencontre l''ambre précieux.', '10 ml · Roll-on', '{"head": "Bergamote, Néroli", "heart": "Jasmin de Grasse", "base": "Ambre chaud, Oud"}'::jsonb, 5.0, 'Bestseller', 150),
('ishq-soleil', 'Soleil d''Oranger', 'Huile de Parfum Ensoleillée', 89.00, 'fresh', 'Frais', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800', 'Un sillage hespéridé et floral évoquant les vergers ensoleillés de Méditerranée.', '10 ml · Roll-on', '{"head": "Bergamote, Mandarine", "heart": "Fleur d''Oranger", "base": "Musc Blanc"}'::jsonb, 4.9, 'Nouveauté', 120),
('ishq-sunset', 'Sunset Club', 'Huile de Parfum Crépusculaire', 95.00, 'intense', 'Intense', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800', 'Une fragrance sophistiquée célébrant l''élégance de la golden hour.', '10 ml · Roll-on', '{"head": "Champagne Pétillant", "heart": "Jasmin de Nuit", "base": "Bois de Cachemire"}'::jsonb, 5.0, 'Édition Limitée', 80)
ON CONFLICT ("id") DO NOTHING;

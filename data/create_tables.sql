BEGIN;

DROP TABLE IF EXISTS "alert", "address_has_erc20", "address_has_nativecoin", "nativecoin", "user_has_addresses", "user", "erc20", "erc721", "address" CASCADE;

-- Création de la table User
CREATE TABLE IF NOT EXISTS "user" (
    "id" serial PRIMARY KEY,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "email" text NOT NULL,
    "is_admin" boolean NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table Address
CREATE TABLE IF NOT EXISTS "address" (
    "id" serial PRIMARY KEY,
    "public_key" text NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table Alert
CREATE TABLE IF NOT EXISTS "alert" (
    "id" serial PRIMARY KEY,
    "type_alert" text NOT NULL,
    "status" boolean NOT NULL,
    "name" text NOT NULL,
    "id_user" integer REFERENCES "user"("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table UserHasAddress
CREATE TABLE IF NOT EXISTS "user_has_addresses" (
    "id" serial PRIMARY KEY,
    "id_user" integer REFERENCES "user"("id"),
    "id_address" integer REFERENCES "address"("id"),
    "is_favorite" boolean NOT NULL,
    "is_owned" boolean NOT NULL,
    "subname" text,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table NativeCoin
CREATE TABLE IF NOT EXISTS "nativecoin" (
    "id" serial PRIMARY KEY,
    "symbol" text NOT NULL,
    "evm" text NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table AddressHasNativeCoin
CREATE TABLE IF NOT EXISTS "address_has_nativecoin" (
    "id" serial PRIMARY KEY,
    "id_address" integer REFERENCES "address"("id"),
    "id_nativecoin" integer REFERENCES "nativecoin"("id"),
    "balance" numeric NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table ERC20
CREATE TABLE IF NOT EXISTS "erc20" (
    "id" serial PRIMARY KEY,
    "contract_address" text NOT NULL,
    "name" text NOT NULL,
    "logo" text,
    "total_supply" numeric,
    "decimals" numeric,
    "symbol" text NOT NULL,
    "price_usd" numeric,
    "price_eth" text,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table AddressHasERC20
CREATE TABLE IF NOT EXISTS "address_has_erc20" (
    "id" serial PRIMARY KEY,
    "id_address" integer REFERENCES "address"("id"),
    "id_erc20" integer REFERENCES "erc20"("id"),
    "balance" numeric NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

-- Création de la table ERC721
CREATE TABLE IF NOT EXISTS "erc721" (
    "id" serial PRIMARY KEY,
    "contract_address" text NOT NULL,
    "collection_name" text NOT NULL,
    "token_id" int NOT NULL,
    "floor_price" numeric NOT NULL,
    "image" text,
    "id_address" integer REFERENCES "address"("id"),
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ
);

INSERT INTO "nativecoin" ("symbol", "evm") VALUES ('eth', '0x1');

COMMIT;

import { Migration } from '@mikro-orm/migrations';

export class Migration20250930045635 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "content_block" ("id" text not null, "title" text null, "description" text null, "block_type" text null, "block_data" jsonb null, "rank" integer null, "product_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "content_block_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_content_block_deleted_at" ON "content_block" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "content_block" cascade;`);
  }

}

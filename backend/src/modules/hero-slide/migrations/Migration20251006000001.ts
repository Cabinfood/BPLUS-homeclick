import { Migration } from '@mikro-orm/migrations';

export class Migration20251006000001 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "hero_slide" ("id" text not null, "title" text not null, "description" text null, "image" text not null, "link" text null, "cta_text" text null, "rank" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "hero_slide_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_hero_slide_deleted_at" ON "hero_slide" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_hero_slide_rank" ON "hero_slide" (rank);`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_hero_slide_is_active" ON "hero_slide" (is_active);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "hero_slide" cascade;`);
  }

}

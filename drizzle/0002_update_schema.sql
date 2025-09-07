CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"todo_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"position" numeric(20, 10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "todos_user_position_idx";--> statement-breakpoint
DROP INDEX "todos_user_completed_idx";--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tasks_user_position_idx" ON "tasks" USING btree ("todo_id","position");--> statement-breakpoint
CREATE INDEX "tasks_user_completed_idx" ON "tasks" USING btree ("todo_id","completed");--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "completed";--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "updated_at";
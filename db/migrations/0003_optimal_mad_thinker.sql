ALTER TYPE "public"."job_status" ADD VALUE 'screening' BEFORE 'interview';--> statement-breakpoint
ALTER TYPE "public"."job_status" ADD VALUE 'interview_hr' BEFORE 'offer';--> statement-breakpoint
ALTER TYPE "public"."job_status" ADD VALUE 'interview_user' BEFORE 'offer';--> statement-breakpoint
ALTER TYPE "public"."job_status" ADD VALUE 'final_interview' BEFORE 'offer';--> statement-breakpoint
ALTER TYPE "public"."job_status" ADD VALUE 'accepted' BEFORE 'rejected';--> statement-breakpoint
ALTER TYPE "public"."job_status" ADD VALUE 'withdrawn';
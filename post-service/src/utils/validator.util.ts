import { z } from "zod"

export const postCreationSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(6, { message: "title must be at least 6 characters long" })
    .max(120, { message: "title must be at most 120 characters long" }),
  content: z
    .string({ required_error: "email is required" })
    .min(6, { message: "content must be at least 6 characters long" })
    .max(1000, { message: "content must be at most 1000 characters long" }),
  media: z.array(z.string()).optional(),
});

export type postCreationData = z.infer<typeof postCreationSchema>;
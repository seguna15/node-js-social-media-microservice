import { z } from "zod"

export const commentCreationSchema = z.object({
  postId: z.string(),
  comment: z
    .string({ required_error: "email is required" })
    .min(2, { message: "content must be at least 2 characters long" })
    .max(120, { message: "content must be at most 120 characters long" }),
});

export type commentCreationData = z.infer<typeof commentCreationSchema> & {
  userId: string
};
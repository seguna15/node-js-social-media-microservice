import { z } from "zod"

export const registrationSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(6, { message: "Username must be at least 6 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" }),
  email: z.string({ required_error: "email is required" }).email(),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one digit" })
    .regex(/[^a-zA-Z0-9\s]/, {
      message: "Password must contain at least one special character",
    }),
});

export type UserRegistrationData = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
  email: z.string({ required_error: "email is required" }).email(),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one digit" })
    .regex(/[^a-zA-Z0-9\s]/, {
      message: "Password must contain at least one special character",
    }),
});

export type UserLoginData = z.infer<typeof loginSchema>;
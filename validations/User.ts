import { z } from "zod";

export const userValidationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be of 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .trim(),
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  role: z.enum(["user", "admin"]).default("user"),
});

export type IUser = z.infer<typeof userValidationSchema>;

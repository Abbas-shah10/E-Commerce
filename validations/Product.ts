import { z } from "zod";

export const productValidationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be of 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z.string().min(10, "Description must be 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string().url("Invalid image URL")),
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
});

export type IProduct = z.infer<typeof productValidationSchema>;

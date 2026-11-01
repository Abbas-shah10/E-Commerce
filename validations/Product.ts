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

export const productSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0),
  category: z.string().min(2),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type IProduct = z.infer<typeof productValidationSchema>;

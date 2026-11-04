import { z } from "zod";
import { isValidObjectId } from "mongoose";

const productId = z
  .string()
  .refine((id) => isValidObjectId(id), "Invalid product");

const quantity = z.coerce
  .number()
  .int("Quantity must be a whole number")
  .min(1, "Quantity must be at least 1")
  .max(99, "Quantity is too high");

export const addToCartSchema = z.object({
  productId,
});

export const updateQuantitySchema = z.object({
  productId,
  quantity,
});

export const removeFromCartSchema = z.object({
  productId,
});

import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    "Price must have exactly two decimal places."
  );

// SCHEMA FOR INSERTING PRODUCT
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// SCHEMA FOR SIGNING USER IN
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

// SCHEMA FOR SIGNING USER UP
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    confirmPassword: z
      .string()
      .min(6, "Password Confirmation must be at least 6 chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

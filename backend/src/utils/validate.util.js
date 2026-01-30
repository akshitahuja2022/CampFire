import { z } from "zod";

const allowedCategories = [
  "tech",
  "art",
  "news",
  "sports",
  "nature",
  "photography",
  "music",
  "gaming",
  "education",
  "startup",
];

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export const campSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(40, "Title must be at most 40 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  category: z
    .array(z.enum(allowedCategories))
    .min(1, "Select at least one category")
    .max(3, "You can select up to 3 categories"),
});

export const userMetaSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters"),
});

export const passwordChangeSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const userInterestsSchema = z.object({
  interests: z.array(z.enum(allowedCategories)),
});

export const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty")
    .max(280, "Post content cannot exceed 280 characters"),
});

export const messageSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters"),
});

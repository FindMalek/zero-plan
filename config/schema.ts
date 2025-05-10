import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(true),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().url("Please enter a valid image URL").optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

// Schema for batch upload form
export const batchUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Please select a file" })
    .refine((file) => file.name.endsWith(".csv"), {
      message: "Only CSV files are allowed",
    })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024, // 10MB max
      { message: "File size must be less than 10MB" }
    ),
})

// Type for batch upload form
export type TBatchUploadSchema = z.infer<typeof batchUploadSchema>

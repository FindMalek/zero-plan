import {
  AccountStatus,
  CardProvider,
  CardStatus,
  CardType,
  PlatformStatus,
  SecretStatus,
  SecretType,
} from "@prisma/client"
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().url("Please enter a valid image URL").optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

export const WaitlistUserRo = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
})

export type WaitlistUserRo = z.infer<typeof WaitlistUserRo>

export const WaitlistUserDtoSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type WaitlistUserDto = z.infer<typeof WaitlistUserDtoSchema>

// User schemas
export const UserDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  emailVerified: z.boolean().default(false),
  image: z.string().url().optional(),
})

export const UserRo = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserDto = z.infer<typeof UserDto>
export type UserRo = z.infer<typeof UserRo>

// Card schemas
export const CardDto = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(CardType),
  provider: z.nativeEnum(CardProvider),
  status: z.nativeEnum(CardStatus).optional().default(CardStatus.ACTIVE),
  number: z.string().min(1, "Card number is required"),
  expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  cvv: z.string().min(1, "CVV is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardholderEmail: z.string().email().optional(),
  containerId: z.string().optional(),
})

export const CardRo = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(CardType),
  provider: z.nativeEnum(CardProvider),
  status: z.nativeEnum(CardStatus),
  number: z.string(),
  expiryDate: z.date(),
  cvv: z.string(),
  billingAddress: z.string(),
  cardholderName: z.string(),
  cardholderEmail: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  containerId: z.string().optional(),
})

export type CardDto = z.infer<typeof CardDto>
export type CardRo = z.infer<typeof CardRo>

// Credential schemas
export const CredentialDto = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  status: z.nativeEnum(AccountStatus).optional().default(AccountStatus.ACTIVE),
  description: z.string().optional(),
  loginUrl: z.string().url().optional(),
  platformId: z.string(),
  containerId: z.string().optional(),
})

export const CredentialRo = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  status: z.nativeEnum(AccountStatus),
  description: z.string().optional(),
  loginUrl: z.string().optional(),
  lastCopied: z.date().optional(),
  lastViewed: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  platformId: z.string(),
  userId: z.string(),
  containerId: z.string().optional(),
})

export type CredentialDto = z.infer<typeof CredentialDto>
export type CredentialRo = z.infer<typeof CredentialRo>

// CredentialMetadata schemas
export const CredentialMetadataDto = z.object({
  recoveryEmail: z.string().email().optional(),
  accountId: z.string().optional(),
  iban: z.string().optional(),
  bankName: z.string().optional(),
  otherInfo: z.string().optional(),
  has2FA: z.boolean().optional().default(false),
  credentialId: z.string(),
})

export const CredentialMetadataRo = z.object({
  id: z.string(),
  recoveryEmail: z.string().optional(),
  accountId: z.string().optional(),
  iban: z.string().optional(),
  bankName: z.string().optional(),
  otherInfo: z.string().optional(),
  has2FA: z.boolean(),
  credentialId: z.string(),
})

export type CredentialMetadataDto = z.infer<typeof CredentialMetadataDto>
export type CredentialMetadataRo = z.infer<typeof CredentialMetadataRo>

// Secret schemas
export const SecretDto = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  type: z.nativeEnum(SecretType),
  status: z.nativeEnum(SecretStatus).optional().default(SecretStatus.ACTIVE),
  expiresAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
  platformId: z.string(),
  containerId: z.string().optional(),
})

export const SecretRo = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(SecretType),
  status: z.nativeEnum(SecretStatus),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  platformId: z.string(),
  containerId: z.string().optional(),
})

export type SecretDto = z.infer<typeof SecretDto>
export type SecretRo = z.infer<typeof SecretRo>

// Platform schemas
export const PlatformDto = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().url().optional(),
  status: z
    .nativeEnum(PlatformStatus)
    .optional()
    .default(PlatformStatus.PENDING),
})

export const PlatformRo = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().optional(),
  status: z.nativeEnum(PlatformStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().optional(),
})

export type PlatformDto = z.infer<typeof PlatformDto>
export type PlatformRo = z.infer<typeof PlatformRo>

// Tag schemas
export const TagDto = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional(),
  containerId: z.string().optional(),
})

export const TagRo = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
  userId: z.string().optional(),
  containerId: z.string().optional(),
})

export type TagDto = z.infer<typeof TagDto>
export type TagRo = z.infer<typeof TagRo>

// Container schemas
export const ContainerDto = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().optional(),
})

export const ContainerRo = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export type ContainerDto = z.infer<typeof ContainerDto>
export type ContainerRo = z.infer<typeof ContainerRo>

/**
 * Centralised Zod form-validation schemas for the frontend.
 *
 * Every schema below intentionally mirrors the matching backend validation:
 *
 *   auth        -> server/src/modules/auth/auth.validation.ts
 *   profile     -> server/src/modules/profile/profile.validation.ts
 *   amenities   -> server/src/modules/amenities/amenity.validation.ts
 *   awards      -> server/src/modules/awards/award.validation.ts
 *   developers  -> server/src/modules/developers/developer.validation.ts
 *   services    -> server/src/modules/services/service.validation.ts
 *   projects   -> server/src/modules/projects/project.validation.ts
 *   contact     -> server/src/modules/contact/contact.validation.ts
 */

import { z } from "zod";

/* ── Shared helpers ────────────────────────────────────────────────────── */

export type FieldErrors = Record<string, string | undefined>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors };

/** Flattens a ZodError into `{ fieldName: firstMessage }`. */
export function flattenZodError(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const key =
      issue.path.length > 0
        ? issue.path.map(String).join(".")
        : "form";

    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}

/** Runs `schema.safeParse` and returns parsed data or field errors. */
export function validateForm<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: flattenZodError(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/* ── Reusable field atoms ──────────────────────────────────────────────── */

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`);

const optionalBoundedText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`);

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    // Only allow normal web URLs.
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const optionalUrlField = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isValidUrl(value),
      `${label} must be a valid URL`
    );

/** Integer entered as a string; empty string is allowed. */
const optionalIntString = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || /^-?\d+$/.test(value), {
      message: `${label} must be a whole number`,
    });

/** Positive number entered as a string; empty string is allowed. */
const positiveNumberString = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (/^\d*\.?\d+$/.test(value) && Number(value) > 0),
      {
        message: `${label} must be a positive number`,
      }
    );

/** UUID validation. */
const uuidField = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || z.string().uuid().safeParse(value).success, {
      message: `${label} is invalid`,
    });

/** Optional date entered as a string. */
const optionalDateString = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value === "" || !Number.isNaN(new Date(value).getTime()),
      {
        message: `${label} must be a valid date`,
      }
    );

/* ── Email ─────────────────────────────────────────────────────────────── */

export const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  // Backend normalises emails before use.
  .transform((value) => value.toLowerCase());

/* ── Prisma enums ──────────────────────────────────────────────────────── */

export const PROPERTY_TYPE_VALUES = [
  "APARTMENT",
  "VILLA",
  "PLOT",
  "TOWNSHIP",
  "COMMERCIAL",
  "OFFICE",
  "RETAIL",
  "INDUSTRIAL",
  "OTHER",
] as const;

export const PROJECT_STATUS_VALUES = [
  "DRAFT",
  "UPCOMING",
  "ACTIVE",
  "SOLD_OUT",
  "COMPLETED",
  "ARCHIVED",
] as const;

/* ── Auth ──────────────────────────────────────────────────────────────── */

export const signInFormSchema = z.object({
  email: emailField,

  // Backend: password minimum length is 8.
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordFormSchema = z.object({
  email: emailField,
});

export const resetPasswordFormSchema = z.object({
  email: emailField,

  // Backend: OTP must contain exactly 6 digits.
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

/** Client-only variant with password confirmation. */
export const resetPasswordWithConfirmSchema =
  resetPasswordFormSchema
    .extend({
      confirmPassword: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.newPassword !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    });

/* ── Profile ───────────────────────────────────────────────────────────── */

export const updateProfileFormSchema = z.object({
  name: requiredText("Name", 200),
  email: emailField,
});

export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(6, "Current password must be at least 6 characters"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

/* ── Amenities ─────────────────────────────────────────────────────────── */

export const amenityFormSchema = z.object({
  name: requiredText("Amenity name", 200),
  slug: requiredText("Slug", 200),
  icon: optionalBoundedText("Icon", 200),
  description: z.string().optional(),
});

/* ── Awards ────────────────────────────────────────────────────────────── */

export const AWARD_YEAR_MIN = 1900;
export const AWARD_YEAR_MAX = 2100;

export const awardFormSchema = z.object({
  name: requiredText("Award name", 200),

  year: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d+$/.test(value), {
      message: "Year must be a valid number",
    })
    .refine(
      (value) =>
        value === "" ||
        (Number(value) >= AWARD_YEAR_MIN &&
          Number(value) <= AWARD_YEAR_MAX),
      {
        message: `Year must be between ${AWARD_YEAR_MIN} and ${AWARD_YEAR_MAX}`,
      }
    ),

  imageUrl: optionalUrlField("Image URL"),

  description: z.string().optional(),

  sortOrder: optionalIntString("Sort order"),

  isActive: z.boolean(),
});

/* ── Developers ────────────────────────────────────────────────────────── */

export const developerFormSchema = z.object({
  name: requiredText("Developer name", 200),
  slug: requiredText("Slug", 200),
  logo: optionalUrlField("Logo URL"),
  website: optionalUrlField("Website URL"),
  description: z.string().optional(),
});

/* ── Services ──────────────────────────────────────────────────────────── */

export const serviceFormSchema = z.object({
  name: requiredText("Service name", 200),
  slug: requiredText("Slug", 200),
  icon: optionalBoundedText("Icon", 200),
  description: z.string().optional(),
  sortOrder: optionalIntString("Sort order"),
  isActive: z.boolean(),
});

/* ── Projects ──────────────────────────────────────────────────────────── */

export const projectFormSchema = z
  .object({
    name: requiredText("Project name", 200),

    slug: requiredText("Slug", 200),

    status: z.enum(PROJECT_STATUS_VALUES),

    propertyType: z.enum(PROPERTY_TYPE_VALUES),

    currency: optionalBoundedText("Currency", 10),

    // Backend expects a UUID or an empty value.
    developerId: uuidField("Selected developer"),

    possessionDate: optionalDateString("Possession date"),

    priceMin: positiveNumberString("Min price"),

    priceMax: positiveNumberString("Max price"),

    address: optionalBoundedText("Address", 500),

    city: optionalBoundedText("City", 100),

    state: optionalBoundedText("State", 100),

    postalCode: optionalBoundedText("Postal code", 20),

    coverImage: optionalUrlField("Cover image URL"),

    description: z.string().optional(),

    amenityIds: z.array(
      z.string().uuid("Selected amenity is invalid")
    ),
  })
  .superRefine((values, ctx) => {
    if (
      values.priceMin !== "" &&
      values.priceMax !== "" &&
      Number(values.priceMax) < Number(values.priceMin)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Max price must be greater than or equal to min price",
        path: ["priceMax"],
      });
    }
  });

/* ── Contact ───────────────────────────────────────────────────────────── */

export const CONTACT_MESSAGE_MIN = 10;
export const CONTACT_MESSAGE_MAX = 2000;
export const CONTACT_PHONE_MAX = 20;

export const contactFormSchema = z.object({
  firstName: requiredText("First name", 100),

  lastName: requiredText("Last name", 100),

  email: emailField,

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(
      CONTACT_PHONE_MAX,
      `Phone number must be at most ${CONTACT_PHONE_MAX} characters`
    ),

  address: requiredText("Address", 300),

  inquiryType: z
    .string()
    .trim()
    .min(1, "Please select an inquiry type"),

  message: z
    .string()
    .trim()
    .min(
      CONTACT_MESSAGE_MIN,
      `Message must be at least ${CONTACT_MESSAGE_MIN} characters`
    )
    .max(
      CONTACT_MESSAGE_MAX,
      `Message must be at most ${CONTACT_MESSAGE_MAX} characters`
    ),
});

/** Maps validated contact form values to the backend API payload. */
export function toContactApiPayload(
  values: z.output<typeof contactFormSchema>
) {
  return {
    name: `${values.firstName} ${values.lastName}`
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200),

    email: values.email,

    phone: values.phone || undefined,

    message: values.message,
  };
}
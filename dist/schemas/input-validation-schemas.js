"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordSchema = exports.resetSchema = exports.registerSchema = exports.settingsSchema = exports.loginSchema = exports.passwordSchema = exports.passwordBaseSchema = exports.emailBaseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const EMAIL_MAX_LENGTH = 256;
const PASSWORD_MAX_LENGTH = 256;
const PASSWORD_MIN_LENGTH = 8;
const lowercaseRegex = /^(?=.*[a-z])/;
const uppercaseRegex = /^(?=.*[A-Z])/;
const numberRegex = /^(?=.*[0-9])/;
const symbolRegex = /^(?=.*[!@#$%^&*()_+={}|[\]\\:';"<>?,./])/;
// base email schema to be used in any email field
exports.emailBaseSchema = zod_1.default.object({
    email: zod_1.default
        .string({
        required_error: "Email is required",
    })
        .min(1, "Email is required")
        .max(EMAIL_MAX_LENGTH, `Email should not exceed ${EMAIL_MAX_LENGTH} characters`)
        .email("Please enter a valid email address"),
});
// base password schema to be used in any password field
exports.passwordBaseSchema = zod_1.default.object({
    password: zod_1.default
        .string({
        required_error: "Password is required",
    })
        .min(PASSWORD_MIN_LENGTH, `Password should at least be ${PASSWORD_MIN_LENGTH} characters long`)
        .max(PASSWORD_MAX_LENGTH, `Password should not exceed ${PASSWORD_MAX_LENGTH} characters long`),
});
// refined password schemata to show every password verfication
const refinedPasswordSchema = zod_1.default
    .string({
    required_error: "Password is required",
})
    .min(PASSWORD_MIN_LENGTH, `Password should be at least ${PASSWORD_MIN_LENGTH} characters long`)
    .refine((value) => lowercaseRegex.test(value), "Password should contain at least one lowercase letter")
    .refine((value) => uppercaseRegex.test(value), "Password should contain at least one uppercase letter")
    .refine((value) => numberRegex.test(value), "Password should contain at least one number")
    .refine((value) => symbolRegex.test(value), "Password should contain at least one symbol");
exports.passwordSchema = zod_1.default.object({
    password: refinedPasswordSchema,
});
// Login Schema
exports.loginSchema = zod_1.default.object({
    ...exports.emailBaseSchema.shape,
    // code: z.optional(z.string())
});
exports.settingsSchema = zod_1.default.object({
    name: zod_1.default.optional(zod_1.default.string())
});
// Signup Schema
exports.registerSchema = zod_1.default.object({
    username: zod_1.default.string({
        required_error: "username is required"
    }),
    ...exports.emailBaseSchema.shape,
    ...exports.passwordBaseSchema.shape,
});
// reset Password Schema
exports.resetSchema = zod_1.default.object({
    email: zod_1.default.string().email({
        message: "Email is required"
    })
});
// new password schema
exports.newPasswordSchema = zod_1.default.object({
    ...exports.passwordBaseSchema.shape,
    confirmPassword: zod_1.default.string({
        required_error: "Confirm password is required",
    }),
})
    .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: "The passwords did not match",
            path: ["confirmPassword"],
        });
    }
});

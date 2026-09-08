import { z } from 'zod';

const identifier = z.string().trim().min(1, 'Identifier is required.').max(128);
const name = z.string().trim().min(2, 'Must contain at least 2 characters.').max(80);
const email = z
  .string()
  .trim()
  .email('Enter a valid email address.')
  .max(254)
  .transform((value) => value.toLowerCase());
const phone = z
  .string()
  .trim()
  .min(7, 'Phone number must contain at least 7 characters.')
  .max(24, 'Phone number must contain at most 24 characters.')
  .regex(/^[+\d\s().-]+$/, 'Enter a valid phone number.');
const district = z.string().trim().min(2).max(80);

const emptyStringToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const optionalText = (maximumLength: number) =>
  z.preprocess(emptyStringToUndefined, z.string().trim().max(maximumLength).optional());

const optionalUrl = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().url('Enter a valid URL.').max(2_048).optional()
);

const listingFields = {
  title: z.string().trim().min(2, 'Title must contain at least 2 characters.').max(80),
  description: optionalText(500),
  price: z.coerce.number().finite().positive('Price must be greater than zero.').max(10_000_000),
  imageUrl: optionalUrl,
  isAvailable: z.boolean().optional(),
};

export const registerCustomerSchema = z
  .object({
    customerId: identifier.optional(),
    name,
    email,
    phone: z.preprocess(emptyStringToUndefined, phone.optional()),
    district: z.preprocess(emptyStringToUndefined, district.optional()),
  })
  .passthrough();

export const registerProviderSchema = z
  .object({
    providerId: identifier.optional(),
    businessName: name,
    email,
    phone,
    providerType: z.enum(['HOME_PRODUCT', 'GENERAL_SERVICE']),
    district,
  })
  .passthrough();

export const createProductSchema = z
  .object({
    productCategoryId: identifier,
    ...listingFields,
  })
  .passthrough();

export const createServiceSchema = z
  .object({
    serviceCategoryId: identifier,
    ...listingFields,
  })
  .passthrough();

export const createOrderSchema = z
  .object({
    productId: identifier.optional(),
    serviceId: identifier.optional(),
    providerId: identifier.optional(),
    note: optionalText(500),
  })
  .passthrough()
  .superRefine((value, context) => {
    const selectedItems = Number(Boolean(value.productId)) + Number(Boolean(value.serviceId));
    if (selectedItems !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['productId'],
        message: 'Provide exactly one of productId or serviceId.',
      });
    }
  });

export const sendMessageSchema = z
  .object({
    text: z.string().trim().min(1, 'Message cannot be empty.').max(2_000),
  })
  .passthrough();

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  })
  .passthrough();

export const updateProviderStatusSchema = z
  .object({
    status: z.enum(['APPROVED', 'BLOCKED']),
  })
  .passthrough();

export const createSupportAdminSchema = z
  .object({
    name,
    email,
  })
  .passthrough();

export const itemIdParamsSchema = z.object({ itemId: identifier }).passthrough();
export const orderIdParamsSchema = z.object({ orderId: identifier }).passthrough();
export const chatIdParamsSchema = z.object({ chatId: identifier }).passthrough();
export const providerIdParamsSchema = z.object({ providerId: identifier }).passthrough();
export const catalogItemParamsSchema = z.object({ id: identifier }).passthrough();

export const catalogProductsQuerySchema = z
  .object({
    district: z.preprocess(emptyStringToUndefined, district.optional()),
    productCategoryId: identifier.optional(),
  })
  .passthrough();

export const catalogServicesQuerySchema = z
  .object({
    district: z.preprocess(emptyStringToUndefined, district.optional()),
    serviceCategoryId: identifier.optional(),
  })
  .passthrough();

export const providersQuerySchema = z
  .object({
    status: z.enum(['PENDING_APPROVAL', 'APPROVED', 'BLOCKED']).optional(),
  })
  .passthrough();

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type RegisterProviderInput = z.infer<typeof registerProviderSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateProviderStatusInput = z.infer<typeof updateProviderStatusSchema>;
export type CreateSupportAdminInput = z.infer<typeof createSupportAdminSchema>;

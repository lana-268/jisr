import assert from 'node:assert/strict';
import type { ZodType } from 'zod';
import {
  catalogProductsQuerySchema,
  chatIdParamsSchema,
  createOrderSchema,
  createProductSchema,
  createServiceSchema,
  createSupportAdminSchema,
  registerCustomerSchema,
  registerProviderSchema,
  sendMessageSchema,
  updateOrderStatusSchema,
  updateProviderStatusSchema,
} from '../validation/schemas.js';

let assertions = 0;

const expectInvalid = (label: string, schema: ZodType, value: unknown): void => {
  const result = schema.safeParse(value);
  assert.equal(result.success, false, `${label} should be rejected`);
  assertions += 1;
};

const customer = registerCustomerSchema.parse({
  name: '  Ayşe Kaya  ',
  email: '  AYSE@example.com ',
  phone: '',
});
assert.equal(customer.name, 'Ayşe Kaya');
assert.equal(customer.email, 'ayse@example.com');
assert.equal(customer.phone, undefined);
assertions += 3;

const provider = registerProviderSchema.parse({
  businessName: '  Mehmet Home Services ',
  email: 'MEHMET@example.com',
  phone: '+90 555 111 22 33',
  providerType: 'GENERAL_SERVICE',
  district: ' Kadıköy ',
});
assert.equal(provider.businessName, 'Mehmet Home Services');
assert.equal(provider.district, 'Kadıköy');
assertions += 2;

const product = createProductSchema.parse({
  productCategoryId: 'category-meals',
  title: ' Chicken Kabsa ',
  price: '350',
  description: '',
  imageUrl: '',
});
assert.equal(product.price, 350);
assert.equal(product.description, undefined);
assert.equal(product.imageUrl, undefined);
assertions += 3;

assert.deepEqual(createOrderSchema.parse({ productId: 'product-1' }), {
  productId: 'product-1',
});
assertions += 1;

assert.deepEqual(sendMessageSchema.parse({ text: '  Merhaba!  ' }), {
  text: 'Merhaba!',
});
assertions += 1;

expectInvalid('customer email', registerCustomerSchema, {
  name: 'Ayşe Kaya',
  email: 'not-an-email',
});
expectInvalid('provider type', registerProviderSchema, {
  businessName: 'Local Business',
  email: 'owner@example.com',
  phone: '+90 555 111 22 33',
  providerType: 'UNKNOWN',
  district: 'Kadıköy',
});
expectInvalid('product price', createProductSchema, {
  productCategoryId: 'category-meals',
  title: 'Chicken Kabsa',
  price: 0,
});
expectInvalid('service image URL', createServiceSchema, {
  serviceCategoryId: 'category-cleaning',
  title: 'Home Cleaning',
  price: 400,
  imageUrl: 'not-a-url',
});
expectInvalid('order without an item', createOrderSchema, {});
expectInvalid('order with two item types', createOrderSchema, {
  productId: 'product-1',
  serviceId: 'service-1',
});
expectInvalid('empty chat message', sendMessageSchema, { text: '   ' });
expectInvalid('invalid order status', updateOrderStatusSchema, { status: 'PENDING' });
expectInvalid('invalid provider status', updateProviderStatusSchema, {
  status: 'PENDING_APPROVAL',
});
expectInvalid('invalid support admin', createSupportAdminSchema, {
  name: 'A',
  email: 'admin-at-example.com',
});
expectInvalid('invalid catalog filter', catalogProductsQuerySchema, {
  district: 'A',
});
expectInvalid('empty chat identifier', chatIdParamsSchema, { chatId: '   ' });

console.log(`Validation schemas passed ${assertions} assertions.`);

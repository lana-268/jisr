import { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Input, Select, Textarea } from '../../../shared/components/FormControls';
import { Toggle } from '../../../shared/components/Toggle';

export interface ListingFormValues { title: string; categoryId: string; price: string; description: string; imageUrl: string; isAvailable: boolean }
export type ListingFormErrors = Partial<Record<keyof ListingFormValues, string>>;
export function validateListing(values: ListingFormValues): ListingFormErrors {
  const errors: ListingFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'A title is required.';
  else if (title.length < 2 || title.length > 80) errors.title = 'Use between 2 and 80 characters.';
  if (!values.categoryId) errors.categoryId = 'Choose a category.';
  if (!values.price || Number(values.price) <= 0) errors.price = 'Enter a price greater than 0.';
  if (values.description.length > 500) errors.description = 'Description cannot exceed 500 characters.';
  if (values.imageUrl) { try { new URL(values.imageUrl); } catch { errors.imageUrl = 'Enter a valid URL including https://'; } }
  return errors;
}

export interface ListingFormProps {
  kind: 'product' | 'service';
  initial?: ListingFormValues;
  categories: { id: string; name: string }[];
  saving: boolean;
  onSubmit: (values: ListingFormValues) => Promise<boolean>;
  onCancel: () => void;
}

const blankValues: ListingFormValues = { title: '', categoryId: '', price: '', description: '', imageUrl: '', isAvailable: true };
export function ListingForm({ kind, initial, categories, saving, onSubmit, onCancel }: ListingFormProps) {
  const [values, setValues] = useState<ListingFormValues>(initial ?? blankValues);
  const [errors, setErrors] = useState<ListingFormErrors>({});
  const title = kind === 'product' ? 'Meal / product name' : 'Service title';
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const nextErrors = validateListing(values); setErrors(nextErrors); if (Object.keys(nextErrors).length) return; const succeeded = await onSubmit({ ...values, title: values.title.trim(), description: values.description.trim(), imageUrl: values.imageUrl.trim() }); if (succeeded) setValues(blankValues); };
  const update = <Key extends keyof ListingFormValues>(key: Key, value: ListingFormValues[Key]) => { setValues((current) => ({ ...current, [key]: value })); if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined })); };
  return <form noValidate onSubmit={submit} className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2"><Input label={title} required value={values.title} onChange={(event) => update('title', event.target.value)} placeholder={kind === 'product' ? 'e.g. Chicken Kabsa' : 'e.g. Home Cleaning'} error={errors.title}/><Select label={`${kind === 'product' ? 'Product' : 'Service'} category`} required value={values.categoryId} onChange={(event) => update('categoryId', event.target.value)} error={errors.categoryId}><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></div>
    <Input label={kind === 'product' ? 'Price in TL' : 'Approximate price in TL'} required type="number" min="1" step="1" value={values.price} onChange={(event) => update('price', event.target.value)} placeholder="e.g. 350" error={errors.price}/>
    <Textarea label="Description" value={values.description} maxLength={501} onChange={(event) => update('description', event.target.value)} placeholder="Tell customers what makes this special…" error={errors.description}/>
    <Input label="Image URL" type="url" value={values.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} placeholder="https://example.com/image.jpg" error={errors.imageUrl}/>
    <Toggle checked={values.isAvailable} onChange={(checked) => update('isAvailable', checked)} label="Available to customers" description="Customers can request this listing while it is available." />
    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" loading={saving}>{initial ? 'Save changes' : `Add ${kind}`}</Button></div>
  </form>;
}

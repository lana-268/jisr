import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { ProductItem, ServiceItem } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { ConfirmDialog } from '../../../shared/components/Feedback';
import { Modal } from '../../../shared/components/Modal';
import { productCategories, serviceCategories } from '../data/mockProviderData';
import { ListingForm, type ListingFormValues } from './ListingForm';
import { ListingTable } from './ListingTable';

type Listing = ProductItem | ServiceItem;
export interface ListingSectionProps {
  kind: 'product' | 'service'; items: Listing[]; providerId: string; saving: boolean;
  onSaveProduct: (values: Omit<ProductItem, 'productId' | 'createdAt'>, id?: string) => Promise<boolean>;
  onSaveService: (values: Omit<ServiceItem, 'serviceId' | 'createdAt'>, id?: string) => Promise<boolean>;
  onPatchProduct: (id: string, changes: Partial<ProductItem>) => Promise<void>;
  onPatchService: (id: string, changes: Partial<ServiceItem>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>; onDeleteService: (id: string) => Promise<void>;
  onViewRequests: () => void;
}
export function ListingSection(props: ListingSectionProps) {
  const [editing, setEditing] = useState<Listing | null | 'new'>(null);
  const [deleting, setDeleting] = useState<Listing | null>(null);
  const categories = props.kind === 'product' ? productCategories.map((item) => ({ id: item.productCategoryId, name: item.name })) : serviceCategories.map((item) => ({ id: item.serviceCategoryId, name: item.name }));
  const categoryName = (id: string) => categories.find((item) => item.id === id)?.name ?? 'Uncategorized';
  const initial: ListingFormValues | undefined = editing && editing !== 'new' ? { title: editing.title, categoryId: 'productCategoryId' in editing ? editing.productCategoryId : editing.serviceCategoryId, price: String(editing.price), description: editing.description ?? '', imageUrl: editing.imageUrl ?? '', isAvailable: editing.isAvailable } : undefined;
  const submit = async (values: ListingFormValues) => {
    const id = editing && editing !== 'new' ? ('productId' in editing ? editing.productId : editing.serviceId) : undefined;
    const common = { providerId: props.providerId, title: values.title, description: values.description || null, price: Number(values.price), imageUrl: values.imageUrl || null, isAvailable: values.isAvailable };
    const ok = props.kind === 'product' ? await props.onSaveProduct({ ...common, productCategoryId: values.categoryId }, id) : await props.onSaveService({ ...common, serviceCategoryId: values.categoryId }, id);
    if (ok) setEditing(null); return ok;
  };
  const toggle = (item: Listing) => 'productId' in item ? props.onPatchProduct(item.productId, { isAvailable: !item.isAvailable }) : props.onPatchService(item.serviceId, { isAvailable: !item.isAvailable });
  const confirmDelete = async () => { if (!deleting) return; if ('productId' in deleting) await props.onDeleteProduct(deleting.productId); else await props.onDeleteService(deleting.serviceId); setDeleting(null); };
  const plural = props.kind === 'product' ? 'Products' : 'Services';
  return <section id="listings" className="scroll-mt-28 rounded-xl border border-border bg-surface shadow-card"><header className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Your offering</p><h2 className="mt-1 text-xl font-semibold text-heading sm:text-2xl">{plural}</h2><p className="mt-1 text-sm text-muted">Manage what nearby customers can discover and request.</p></div><Button className="w-full sm:w-auto" icon={<Plus className="h-4 w-4"/>} onClick={() => setEditing('new')}>Add {props.kind}</Button></header><div className="p-3 sm:p-5"><ListingTable kind={props.kind} items={props.items} categoryName={categoryName} onEdit={setEditing} onToggle={(item) => void toggle(item)} onDelete={setDeleting} onAdd={() => setEditing('new')} onViewRequests={props.onViewRequests}/></div>
    <Modal open={editing !== null} onClose={() => setEditing(null)} title={`${editing === 'new' ? 'Add' : 'Edit'} ${props.kind}`} description="Fields marked required must be completed." size="lg"><ListingForm key={editing === 'new' ? 'new' : editing ? ('productId' in editing ? editing.productId : editing.serviceId) : 'closed'} kind={props.kind} initial={initial} categories={categories} saving={props.saving} onSubmit={submit} onCancel={() => setEditing(null)}/><p className="mt-4 text-center text-xs text-muted">Demo tip: use an image URL containing error.test to preview a failed save.</p></Modal>
    <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => void confirmDelete()} title={`Delete ${props.kind}?`} message={`Are you sure you want to delete “${deleting?.title ?? ''}”? This action cannot be undone in this demo.`} confirmLabel="Delete" danger loading={props.saving}/>
  </section>;
}

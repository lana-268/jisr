import { format, formatDistanceToNow } from '../utils/date';

export { format, formatDistanceToNow };

export function formatProviderType(type: string): string {
  const map: Record<string, string> = {
    HOME_PRODUCT: 'Home Products',
    GENERAL_SERVICE: 'General Services',
  };
  return map[type] ?? type;
}

export function formatAdminRole(role: string): string {
  const map: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    SUPPORT_ADMIN: 'Support Admin',
  };
  return map[role] ?? role;
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING_APPROVAL: 'Pending Approval',
    APPROVED: 'Approved',
    BLOCKED: 'Blocked',
    ACTIVE: 'Active',
    OPEN: 'Open',
    CLOSED: 'Closed',
  };
  return map[status] ?? status;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

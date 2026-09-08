import { describe, expect, it } from 'vitest';
import type { Order } from '../../../types';
import { calculateStatistics, canTransitionOrderStatus } from './dashboard';

const orders: Order[] = [
  { orderId: '1', customerId: '1', customerName: 'A', providerId: 'p', itemTitle: 'One', totalPrice: 100, status: 'PENDING', createdAt: '' },
  { orderId: '2', customerId: '2', customerName: 'B', providerId: 'p', itemTitle: 'Two', totalPrice: 250, status: 'IN_PROGRESS', createdAt: '' },
  { orderId: '3', customerId: '3', customerName: 'C', providerId: 'p', itemTitle: 'Three', totalPrice: 400, status: 'COMPLETED', createdAt: '' },
  { orderId: '4', customerId: '4', customerName: 'D', providerId: 'p', itemTitle: 'Four', totalPrice: 900, status: 'CANCELLED', createdAt: '' },
];

describe('dashboard utilities', () => {
  it('calculates statistics from order state', () => expect(calculateStatistics(orders)).toEqual({ pendingOrders: 1, inProgressOrders: 1, completedOrders: 1, totalEarnings: 400 }));
  it('accepts valid order transitions', () => { expect(canTransitionOrderStatus('PENDING', 'IN_PROGRESS')).toBe(true); expect(canTransitionOrderStatus('IN_PROGRESS', 'COMPLETED')).toBe(true); });
  it('rejects invalid order transitions', () => { expect(canTransitionOrderStatus('COMPLETED', 'PENDING')).toBe(false); expect(canTransitionOrderStatus('CANCELLED', 'COMPLETED')).toBe(false); });
});

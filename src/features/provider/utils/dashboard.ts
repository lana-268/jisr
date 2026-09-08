import type { DashboardStatistics, Order, OrderStatus } from '../../../types';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

export function calculateStatistics(orders: Order[]): DashboardStatistics {
  return orders.reduce<DashboardStatistics>(
    (stats, order) => ({
      pendingOrders: stats.pendingOrders + (order.status === 'PENDING' ? 1 : 0),
      inProgressOrders: stats.inProgressOrders + (order.status === 'IN_PROGRESS' ? 1 : 0),
      completedOrders: stats.completedOrders + (order.status === 'COMPLETED' ? 1 : 0),
      totalEarnings: stats.totalEarnings + (order.status === 'COMPLETED' ? order.totalPrice : 0),
    }),
    { pendingOrders: 0, inProgressOrders: 0, completedOrders: 0, totalEarnings: 0 },
  );
}

export function canTransitionOrderStatus(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };
  return transitions[currentStatus].includes(nextStatus);
}

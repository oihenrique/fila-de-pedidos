export interface OrderCreatedEvent {
  orderId: string;
  payload: {
    customerId: string;
    items: { sku: string; qty: number; price: number }[];
    currency: string;
  };
  metadata: { traceId: string; createdAt: string; schemaVersion: number };
}

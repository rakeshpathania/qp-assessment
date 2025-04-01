export interface OrderItemRequest {
    groceryItemId: number;
    quantity: number;
}

export interface CreateOrderRequest {
    items: OrderItemRequest[];
}
import { Repository } from 'typeorm';
import { Order } from '../database/entities/order.js';
import { OrderItem } from '../database/entities/orderItem.js';
import { GroceryItem } from '../database/entities/groceryItem.js';
import { BadRequestError, NotFoundError } from '../utils/errorHandlers.js';
import { AppDataSource } from '../database/dataSource.js';
import { CreateOrderRequest, OrderItemRequest } from '../types/orderTypes.js';


export class OrderService {
    private orderRepo: Repository<Order>;
    private orderItemRepo: Repository<OrderItem>;
    private groceryItemRepo: Repository<GroceryItem>;

    constructor() {
        this.orderRepo = AppDataSource.getRepository(Order);
        this.orderItemRepo = AppDataSource.getRepository(OrderItem);
        this.groceryItemRepo = AppDataSource.getRepository(GroceryItem);
    }
    private async validateOrderItems(items: OrderItemRequest[]): Promise<void> {
        if (!items || items.length === 0) {
            throw new BadRequestError('Order must contain at least one item');
        }

        for (const item of items) {
            if (item.quantity <= 0) {
                throw new BadRequestError('Item quantity must be greater than 0');
            }

            const groceryItem = await this.groceryItemRepo.findOne({
                where: { id: item.groceryItemId }
            });

            if (!groceryItem) {
                throw new BadRequestError(`Grocery item with id ${item.groceryItemId} not found`);
            }
        }
    }
    async createOrder(userId: number, orderRequest: CreateOrderRequest): Promise<Order> {
        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            await this.validateOrderItems(orderRequest.items);

            const order = new Order();
            order.userId = userId;
            order.status = 'PENDING';
            order.totalAmount = 0;
            const savedOrder = await transactionalEntityManager.save(Order, order);

            const orderItems: OrderItem[] = [];
            let totalAmount = 0;

            for (const item of orderRequest?.items) {
                const groceryItem = await transactionalEntityManager.findOne(GroceryItem, {
                    where: { id: item.groceryItemId }
                });

                if (!groceryItem) {
                    throw new BadRequestError(`Grocery item with id ${item?.groceryItemId} not found`);
                }

                if (groceryItem?.quantityInStock < item?.quantity) {
                    throw new BadRequestError(
                        `Insufficient stock for item ${groceryItem.name}. Available: ${groceryItem?.quantityInStock}`
                    );
                }

                groceryItem.quantityInStock -= item.quantity;
                await transactionalEntityManager.save(GroceryItem, groceryItem);

                const orderItem = new OrderItem();
                orderItem.order = savedOrder;
                orderItem.groceryItem = groceryItem;
                orderItem.quantity = item.quantity;
                orderItems.push(orderItem);
                const subtotal = groceryItem.price * item.quantity;
                totalAmount += subtotal;
            }

            await transactionalEntityManager.save(OrderItem, orderItems);
            savedOrder.totalAmount = totalAmount;
            await transactionalEntityManager.save(Order, savedOrder);

            return savedOrder;
        });
    }



    async getOrderById(orderId: number): Promise<Order> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['orderItems', 'orderItems.groceryItem']
        });

        if (!order) {
            throw new NotFoundError('Order not found');
        }

        return order;
    }

    async getUserOrders(userId: number): Promise<Order[]> {
        return await this.orderRepo.find({
            where: { userId },
            relations: ['orderItems', 'orderItems.groceryItem'],
            order: { createdAt: 'DESC' }
        });
    }
}
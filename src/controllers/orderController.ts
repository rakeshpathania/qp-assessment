import { Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService.js';
import { RequestWithUser } from '../middlewares/authenticate.js';
import { CreateOrderRequest } from '../types/orderTypes.js';
import { STATUS_CODES, SUCCESS_CREATED_STATUS, SUCCESS_STATUS } from '../utils/errorHandlers.js';

const orderService = new OrderService();

const createOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orderRequest: CreateOrderRequest = req.body;
        const userId = req.user.id;
        const order = await orderService.createOrder(userId, orderRequest);
        res.status(STATUS_CODES.CREATED).json(
            SUCCESS_CREATED_STATUS("Order created successfully", order)
        );
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orderId = parseInt(req.params.orderId);
        const order = await orderService.getOrderById(orderId);
        res.status(STATUS_CODES.OK).json(
            SUCCESS_STATUS("Order fetched successfully", order)
        );
    } catch (error) {
        next(error);
    }
};

const getUserOrders = async(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const orders = await orderService.getUserOrders(userId);
        res.status(STATUS_CODES.OK).json(
            SUCCESS_STATUS("Orders fetched successfully", orders)
        );
    } catch (error) {
        next(error);
    }
};

export const orderController = {
    createOrder,
    getOrderById,
    getUserOrders
};

export default orderController;

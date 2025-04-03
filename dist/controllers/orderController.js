import { OrderService } from '../services/orderService.js';
import { STATUS_CODES, SUCCESS_CREATED_STATUS, SUCCESS_STATUS } from '../utils/errorHandlers.js';
const orderService = new OrderService();
const createOrder = async (req, res, next) => {
    try {
        const orderRequest = req.body;
        const userId = req.user.id;
        const order = await orderService.createOrder(userId, orderRequest);
        res.status(STATUS_CODES.CREATED).json(SUCCESS_CREATED_STATUS("Admin registered successfully", order));
    }
    catch (error) {
        next(error);
    }
};
const getOrderById = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const order = await orderService.getOrderById(orderId);
        res.status(STATUS_CODES.OK).json(SUCCESS_STATUS("Order fetched successfully", order));
    }
    catch (error) {
        next(error);
    }
};
const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await orderService.getUserOrders(userId);
        res.status(STATUS_CODES.OK).json(SUCCESS_STATUS("Orders fetched successfully", orders));
    }
    catch (error) {
        next(error);
    }
};
export const orderController = {
    createOrder,
    getOrderById,
    getUserOrders
};
export default orderController;

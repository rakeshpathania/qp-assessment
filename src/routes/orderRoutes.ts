import { Router} from "express";
import orderController from "../controllers/orderController.js";
import { userAuthenticate } from "../middlewares/authenticate.js";
import { validateRequest } from "../middlewares/validate.js";
import { createOrderSchema} from "../utils/validations/orderRules.js";

const router: Router = Router();

router.post(
  '/',
  userAuthenticate,
  validateRequest(createOrderSchema),
  orderController.createOrder
);

router.get(
    '/:orderId',
    userAuthenticate,
    orderController.getOrderById
);

router.get(
    '/by/user/:userId',
    userAuthenticate,
    orderController.getUserOrders
);

export default router;

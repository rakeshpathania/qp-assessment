import { Router} from "express";
import { validateRequest } from "../middlewares/validate.js";
import groceryController from "../controllers/groceryController.js";
import { addGroceryItemRules, updateGroceryItemRules, updateInventoryLevelRules} from "../utils/validations/groceryRules.js";
import { adminAuthenticate } from "../middlewares/authenticate.js";

const router: Router = Router();

router.post(
  '/',
  adminAuthenticate,
  validateRequest(addGroceryItemRules),
  groceryController.addGroceryItem
);
router.get(
    '/',
    groceryController.getGroceryItems
);
router.delete(
    '/:id',
    adminAuthenticate,
    groceryController.removeGroceryItem
);
router.put(
    '/:id',
    adminAuthenticate,
    validateRequest(updateGroceryItemRules),
    groceryController.updateGroceryItem
);
router.put(
    '/:id/manage-inventory',
    adminAuthenticate,
    validateRequest(updateInventoryLevelRules),
    groceryController.updateInventoryLevel
);

router.get(
    '/available-grocery',
    groceryController.getAvailableGroceryItems
);
export default router;

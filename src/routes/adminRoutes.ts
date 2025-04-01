import { Router} from "express";
import { validateRequest } from "../middlewares/validate.js";
import adminAuthController from "../controllers/adminController.js";
import { adminRegistrationRules, adminLoginRules} from "../utils/validations/adminAuthRules.js";
import { adminAuthenticate } from "../middlewares/authenticate.js";
const router: Router = Router();

router.post(
  '/',
  validateRequest(adminRegistrationRules),
  adminAuthController.registerAdmin
);
router.post(
    '/login',
    validateRequest(adminLoginRules),
    adminAuthController.loginAdmin
  );
router.post(
    '/logout',
    adminAuthenticate,
    adminAuthController.logoutAdmin
);

export default router;

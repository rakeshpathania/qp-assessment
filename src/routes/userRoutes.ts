import { Router} from "express";
import { validateRequest } from "../middlewares/validate.js";
import userAuthController from "../controllers/userController.js";
import { userRegistrationRules, userLoginRules} from "../utils/validations/userAuthRules.js";
import { userAuthenticate } from "../middlewares/authenticate.js";
const router: Router = Router();

router.post(
  '/',
  validateRequest(userRegistrationRules),
  userAuthController.registerUser
);
router.post(
    '/login',
    validateRequest(userLoginRules),
    userAuthController.loginUser
  );
router.post(
    '/logout',
    userAuthenticate,
    userAuthController.logoutUser
);

export default router;

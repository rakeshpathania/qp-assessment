import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES, SUCCESS_CREATED_STATUS, SUCCESS_STATUS } from '../utils/errorHandlers.js';
import { UserAuthService } from '../services/userAuthService.js';
import { AppDataSource } from '../database/dataSource.js';
import { RequestWithUser } from '../middlewares/authenticate.js';
import { LoginUserRequest, RegisterUserRequest } from '../types/userTypes.js';


const userService = new UserAuthService(AppDataSource);

const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userData: RegisterUserRequest = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        const result = await userService.register(userData);

        res.status(STATUS_CODES.CREATED).json(
            SUCCESS_CREATED_STATUS("User registered successfully", {
                user: result.user,
                token: result.token
            })
        );
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loginData: LoginUserRequest = {
            email: req.body.email,
            password: req.body.password
        };

        const result = await userService.login(loginData);

        res.status(STATUS_CODES.OK).json(
            SUCCESS_STATUS("User logged in successfully", {
                user: result.user,
                token: result.token
            })
        );
    } catch (error) {
        next(error);
    }
};
const logoutUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    
        await userService.logout({userId, token});

        res.status(STATUS_CODES.OK).json(
            SUCCESS_STATUS("User logged out successfully")
        );
    } catch (error) {
        next(error);
    }
};



export const userAuthController = {
    registerUser,
    loginUser,
    logoutUser
};

export default userAuthController;

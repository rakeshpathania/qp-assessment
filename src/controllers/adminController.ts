import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES, SUCCESS_CREATED_STATUS, SUCCESS_STATUS } from '../utils/errorHandlers.js';
import { AdminAuthService } from '../services/adminAuthService.js';
import { AppDataSource } from '../database/dataSource.js';
import { RequestWithUser } from '../middlewares/authenticate.js';
import { LoginAdminRequest, RegisterAdminRequest } from '../types/adminTypes.js';



const adminService = new AdminAuthService(AppDataSource);

const registerAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminData: RegisterAdminRequest = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        const result = await adminService.register(adminData);

        res.status(STATUS_CODES.CREATED).json(
            SUCCESS_CREATED_STATUS("Admin registered successfully", {
                admin: result.admin,
                token: result.token
            })
        );
    } catch (error) {
        next(error);
    }
};

const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loginData: LoginAdminRequest = {
            email: req.body.email,
            password: req.body.password
        };

        const result = await adminService.login(loginData);

        res.status(STATUS_CODES.OK).json(
            SUCCESS_STATUS("Admin logged in successfully", {
                admin: result.admin,
                token: result.token
            })
        );
    } catch (error) {
        next(error);
    }
};

const logoutAdmin = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.admin.id;
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    
        await adminService.logout({userId: adminId, token});

        res.status(STATUS_CODES.OK).json(
            SUCCESS_STATUS("Admin logged out successfully")
        );
    } catch (error) {
        next(error);
    }
};



export const adminAuthController = {
    registerAdmin,
    loginAdmin,
    logoutAdmin
};

export default adminAuthController;

import { Admin } from "../database/entities/admin.js";
import { BlacklistedToken } from "../database/entities/blackListedToken.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorHandlers.js";
import bcrypt from "bcrypt";
import { GeneratePassword, GenerateSalt, GenerateSignature } from "../utils/helpers.js";
export class AdminAuthService {
    dataSource;
    adminRepo;
    blackListedTokenRepo;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.adminRepo = this.dataSource.getRepository(Admin);
        this.blackListedTokenRepo = this.dataSource.getRepository(BlacklistedToken);
    }
    // Register a new admin
    async register(adminData) {
        try {
            const existingAdmin = await this.adminRepo.findOne({
                where: { email: adminData.email },
                select: ['id']
            });
            if (existingAdmin) {
                throw new BadRequestError("Email is already in use");
            }
            const salt = await GenerateSalt();
            const passwordHash = await GeneratePassword(adminData.password, salt);
            const savedAdmin = await this.adminRepo.manager.transaction(async (transactionalEntityManager) => {
                const newAdmin = this.adminRepo.create({
                    name: adminData?.name,
                    email: adminData?.email,
                    passwordHash,
                });
                return await transactionalEntityManager.save(newAdmin);
            });
            const token = await GenerateSignature({
                id: savedAdmin.id,
                email: savedAdmin.email,
                isAdmin: true
            });
            if (typeof token !== "string") {
                throw new BadRequestError("Failed to generate authentication token");
            }
            return {
                admin: {
                    id: savedAdmin?.id,
                    name: savedAdmin?.name,
                    email: savedAdmin?.email,
                },
                token
            };
        }
        catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new BadRequestError(`Registration failed: ${error.message}`);
            }
            throw new BadRequestError("Registration failed: Unknown error occurred");
        }
    }
    // Admin login
    async login(credentials) {
        try {
            const admin = await this.adminRepo.findOne({ where: { email: credentials.email } });
            if (!admin) {
                throw new UnauthorizedError("Invalid email or password");
            }
            const isPasswordValid = await bcrypt.compare(credentials?.password, admin?.passwordHash);
            if (!isPasswordValid) {
                throw new UnauthorizedError("Invalid email or password");
            }
            const token = await GenerateSignature({
                id: admin.id,
                email: admin.email,
                isAdmin: true
            });
            if (typeof token !== "string") {
                throw new BadRequestError("Failed to generate authentication token");
            }
            return {
                admin: {
                    id: admin?.id,
                    name: admin?.name,
                    email: admin?.email,
                },
                token
            };
        }
        catch (error) {
            if (error instanceof UnauthorizedError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new BadRequestError(`Error logging in: ${error.message}`);
            }
            else {
                throw new BadRequestError("Error logging in: Unknown error occurred");
            }
        }
    }
    async getAdminById(adminId) {
        try {
            return await this.adminRepo.findOne({ where: { id: adminId } });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error fetching admin: ${error.message}`);
            }
            else {
                throw new BadRequestError("Error fetching admin: Unknown error occurred");
            }
        }
    }
    async logout(logoutData) {
        try {
            const newItem = this.blackListedTokenRepo.create(logoutData);
            return await this.blackListedTokenRepo.save(newItem);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error logging out: ${error.message}`);
            }
            else {
                throw new BadRequestError("Error logging out: Unknown error occurred");
            }
        }
    }
    async getBlacklistedToken(token) {
        try {
            return await this.blackListedTokenRepo.findOne({ where: { token } });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error fetching blacklisted token: ${error.message}`);
            }
            else {
                throw new BadRequestError("Error fetching blacklisted token: Unknown error occurred");
            }
        }
    }
}

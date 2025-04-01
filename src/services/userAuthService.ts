import { Repository, DataSource } from "typeorm";
import { User } from "../database/entities/user.js";
import { BlacklistedToken } from "../database/entities/blackListedToken.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorHandlers.js";
import bcrypt from "bcrypt";
import { GeneratePassword, GenerateSalt, GenerateSignature } from "../utils/helpers.js";
import { UserData, UserResponse } from "../types/userTypes.js";
import { LogoutData } from "../types/adminTypes.js";


export class UserAuthService {
    private readonly UserRepo: Repository<User>;
    private blackListedTokenRepo: Repository<BlacklistedToken>;
    constructor(private dataSource: DataSource) {
        this.UserRepo = this.dataSource.getRepository(User);
        this.blackListedTokenRepo = this.dataSource.getRepository(BlacklistedToken);

    }

    // Register a new User
    async register(UserData: UserData): Promise<UserResponse> {
        try {
            const existingUser = await this.UserRepo.findOne({
                where: { email: UserData.email },
                select: ['id']
            });

            if (existingUser) {
                throw new BadRequestError("Email is already in use");
            }

            const salt = await GenerateSalt();
            const passwordHash = await GeneratePassword(UserData.password, salt);

            const savedUser = await this.UserRepo.manager.transaction(async (transactionalEntityManager) => {
                const newUser = this.UserRepo.create({
                    name: UserData?.name,
                    email: UserData?.email,
                    passwordHash,
                });

                return await transactionalEntityManager.save(newUser);
            });

            const token = await GenerateSignature({
                id: savedUser.id,
                email: savedUser.email
            });

            if (typeof token !== "string") {
                throw new BadRequestError("Failed to generate authentication token");
            }

            return {
                user: {
                    id: savedUser?.id,
                    name: savedUser?.name,
                    email: savedUser?.email,
                },
                token
            };

        } catch (error: unknown) {
            if (error instanceof BadRequestError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new BadRequestError(`Registration failed: ${error.message}`);
            }

            throw new BadRequestError("Registration failed: Unknown error occurred");
        }
    }

    // User login
    async login(credentials: { email: string; password: string }): Promise<UserResponse> {
        try {
            const user = await this.UserRepo.findOne({ where: { email: credentials.email } });
            if (!user) {
                throw new UnauthorizedError("Invalid email or password");
            }

            const isPasswordValid = await bcrypt.compare(credentials?.password, user?.passwordHash);
            if (!isPasswordValid) {
                throw new UnauthorizedError("Invalid email or password");
            }

            const token = await GenerateSignature({
                id: user?.id,
                email: user?.email
            });
            if (typeof token !== "string") {
                throw new BadRequestError("Failed to generate authentication token");
            }
            return {
                user: {
                    id: user?.id,
                    name: user?.name,
                    email: user?.email,
                },
                token
            };
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new BadRequestError(`Error logging in: ${error.message}`);
            } else {
                throw new BadRequestError("Error logging in: Unknown error occurred");
            }
        }
    }
    async getUserById(userId: number): Promise<User | null> {
        try {
            return await this.UserRepo.findOne({ where: { id: userId } });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error fetching user: ${error.message}`);
            } else {
                throw new BadRequestError("Error fetching user: Unknown error occurred");
            }
        }
    }

    async logout(logoutData: LogoutData): Promise<BlacklistedToken> {
        try {
            const newItem = this.blackListedTokenRepo.create(logoutData);
            return await this.blackListedTokenRepo.save(newItem);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new BadRequestError(`Error logging out: ${error.message}`);
            } else {
                throw new BadRequestError("Error logging out: Unknown error occurred");
            }
        }
    }



}

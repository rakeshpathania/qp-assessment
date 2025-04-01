import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const APP_SECRET = process.env.APP_SECRET || "your_jwt_secret";

export const GenerateSalt = async (rounds: number = 10): Promise<string> => {
    return await bcrypt.genSalt(rounds);
};

export const GeneratePassword = async (
    password: string, 
    salt: string
): Promise<string> => {
    return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
): Promise<boolean> => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

interface TokenPayload {
    id?: string | number;
    email?: string;
    [key: string]: any; 
}

export const GenerateSignature = async (payload: TokenPayload): Promise<string | Error> => {
    try {
        const token = jwt.sign(payload, APP_SECRET, { expiresIn: "24h" });
        return token;
    } catch (error) {
        return error as Error;
    }
};



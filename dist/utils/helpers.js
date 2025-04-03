import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const APP_SECRET = process.env.APP_SECRET || "your_jwt_secret";
export const GenerateSalt = async (rounds = 10) => {
    return await bcrypt.genSalt(rounds);
};
export const GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};
export const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
export const GenerateSignature = async (payload) => {
    try {
        const token = jwt.sign(payload, APP_SECRET, { expiresIn: "24h" });
        return token;
    }
    catch (error) {
        return error;
    }
};

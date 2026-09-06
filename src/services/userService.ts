import userModel, { IUser } from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const register = async ({ firstName, lastName, email, password }: RegisterParams) => {
    const findUser = await userModel.findOne({ email: email });

    if (findUser) {
        return { data: 'User already exists', statusCode: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();
    return { data: generateJWT(newUser), statusCode: 200 };
};

interface LoginParams {
    email: string;
    password: string;
}

export const login = async ({ email, password }: LoginParams) => {
    const findUser = await userModel.findOne({ email: email });

    if (!findUser) {
        return { data: 'User not found', statusCode: 404 };
    }

    const matchedPassword = await bcrypt.compare(password, findUser.password);
    if (!matchedPassword) {
        return { data: 'Invalid password', statusCode: 400 };
    }

    return { data: generateJWT(findUser), statusCode: 200 };
};

const generateJWT = (user: IUser) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

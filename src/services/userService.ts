import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const register = async ({ firstName, lastName, email, password }: RegisterParams) => {
    const findUser = await userModel.findOne({ email: email });

    if (findUser) {
        return { data:'User already exists', statusCode: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUSer = new userModel({ firstName, lastName, email, password: hashedPassword });
    await newUSer.save();
    return { data: generateJWT(newUSer), statusCode: 200};
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

    return {data: generateJWT({
        email: findUser.email,
        firstName: findUser.firstName,
        lastName: findUser.lastName
    }), statusCode: 200};
};

const generateJWT = (user: any) => {
    const payload = {
        id: user._id,
        email: user.email
    };
    return jwt.sign(payload, 'secret', { expiresIn: '24h' });
};
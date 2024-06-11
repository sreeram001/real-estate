import User from "../models/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";
import { JWTToken } from '../config/jwtToken';

const SALT_ROUNDS = 10;
const JWT_SECRET = 'real-estate'; // Replace with your actual JWT secret

export default class UserService {
    static async registerUser(body: any) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        body.salt = salt
        body.password = hashedPassword
        const user = await User.create(body);
        const token = JWTToken.create({ id: user.id, email: user.email, mobile_no: user.mobile_no, role: user.role });
        return { token };
    }
    static async loginUser(body: any) {
        // Find user by email or mobile number
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: body.input }, { mobile_no: Number(body.input) || 0 }]
            }
        });
        if (!user) {
            return { data: null, error: "User not found" };
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return { data: null, error: "invalid Password" };
        }
        // Generate token
        const token = JWTToken.create({ id: user.id, email: user.email, mobile_no: user.mobile_no,role:user.role });
        return { data: token, error: null };
    }
}
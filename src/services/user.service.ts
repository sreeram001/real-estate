import User from "../models/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";
import { JWTToken } from '../config/jwtToken';
import Session from "../models/session";

const SALT_ROUNDS = 10;
const JWT_SECRET = 'real-estate'; // Replace with your actual JWT secret

interface DecodedToken {
    id: number;
    email: string;
    mobile_no: number;
    role: string;
}

export default class UserService {
    static async registerUser(body: any) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        body.salt = salt
        body.password = hashedPassword
        const user = await User.create(body);
        const token = JWTToken.create({ id: user.id, email: user.email, mobile_no: user.mobile_no, role: user.role });
        return { token, id: user.id };
    }

    static async saveSession(token: string, id: number) {
        const session = {
            user_id: id,
            session_token: token,
        }
        const user = await Session.create(session);
        return { user };
    }
    static async sessionUpdate(token: string) {

        const decodedToken = jwt.decode(token) as DecodedToken | null;
        console.log(decodedToken);

        // Step 1: Delete existing session
        const existingSession = await Session.findOne({
            where: {
                user_id: decodedToken?.id,
            },
        });

        if (existingSession) {
            await existingSession.destroy();
        }

        const tokenUpdated = JWTToken.create({ id: decodedToken?.id, email: decodedToken?.email, mobile_no: decodedToken?.mobile_no, role: decodedToken?.role });

        // Step 2: Insert new session
        await Session.create({
            user_id: decodedToken?.id,
            session_token: tokenUpdated,
        });

        return { data: tokenUpdated, error: null };
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
        const session = await Session.findOne({ where: { user_id: user.id } });
        let token = ""
        if (session) {
            return { data: { message: "already logged in another device", token: session.session_token, id: session.id }, error: 2 };
        }

        token = JWTToken.create({ id: user.id, email: user.email, mobile_no: user.mobile_no, role: user.role });
        // Generate token
        return { data: { message: "already logged in another device", token: token, id: user.id }, error: null };
    }
    static async logout(token: string) {
        const deletedSession = await Session.destroy({
            where: { session_token: token }
        });
    }
}
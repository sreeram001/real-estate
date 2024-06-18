import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/user";
import Session from "../models/session";
import { JWTToken } from "../config/jwtToken";
import { nullToString } from "../utils/helper";
import { currentUTCtime } from "../config/moment";

const SALT_ROUNDS = 10;

interface DecodedToken {
  id: number;
  email: string;
  mobile_no: number;
  role: string;
  approved: boolean;
}

export default class UserService {
  static async registerUser(body: any) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const password = body.password || "Admin@123";
    const account_count = body.account_count || 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedBody = {
      ...body,
      salt: salt,
      password: hashedPassword,
      account_count: account_count
    };
    const user = await User.create(updatedBody);
    // const token = JWTToken.create({ id: user.id, email: user.email, mobile_no: user.mobile_no, role: user.role });
    return { id: user.id };
  }

  static async saveSession(token: string, id: number) {
    const session = {
      user_id: id,
      session_token: token
    };
    const user = await Session.create(session);
    return { user };
  }
  static async updateDate(id: number) {
    await User.update({ last_logged_in: currentUTCtime() }, { where: { id: id } });

    // await User.update({})
  }
  static async sessionUpdate(token: string) {
    const decodedToken = jwt.decode(token) as DecodedToken | null;

    const tokenUpdated = JWTToken.create({
      id: decodedToken?.id,
      email: decodedToken?.email,
      mobile_no: decodedToken?.mobile_no,
      role: decodedToken?.role
    });

    //Insert new session
    await Session.create({
      user_id: decodedToken?.id,
      session_token: tokenUpdated
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
    let token = "";
    if (session) {
      const jwtCustomerToken = JWTToken.validateJWTToken(nullToString(session?.session_token));
      if (jwtCustomerToken) {
        return { data: { message: "already logged in another device", token: session.session_token, id: session.id }, error: 2 };
      }
      session.destroy();
    }

    // Generate token
    token = JWTToken.create({ id: user.id, email: user.email, mobile_no: user.mobile_no, role: user.role });
    if (!user.approved) {
      return { data: { message: "please change the password", token: token, id: user.id }, error: 1 };
    }
    return { data: { message: "logged in successfully", token: token, id: user.id }, error: null };
  }

  static async logout(token: string) {
    await Session.destroy({
      where: { session_token: token }
    });
  }

  static async updatePassword(password: string, id: number) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.update({ password: hashedPassword, salt: salt, approved: true }, { where: { id: id } });
  }

  static async sessionCreate(id: number, token: string) {
    await Session.create({
      user_id: id,
      session_token: token
    });
  }

  static async userSelect(id: number) {
    return await User.findOne({
      where: {
        id: id,
        approved: true
      }
    });
  }

  static async checkIfEligible(id: number) {
    const totalCount = await User.findByPk(id, {
      attributes: ["account_count"]
    });

    const activeUserCount = await User.count({
      where: {
        created_by: id,
        status: true
      }
    });

    if (totalCount?.dataValues.account_count >= activeUserCount) {
      return true;
    }
    return false;

    // if (count )
  }
}

import jwt from 'jsonwebtoken';
const jwtSecurityKey = "real-estate"
interface JwtPayload {
  id: number,
  email: string,
  mobile_no: number,
}
export class JWTToken {
  static create(data: any) {
    const token = jwt.sign(
      data,
      jwtSecurityKey,
      {
        expiresIn: "1d",
      }
    );
    return token;
  }

  static validateJWTToken(token: any) {
    try {
      const decodedJwtToken = jwt.verify(token, jwtSecurityKey) as JwtPayload | string;
      return decodedJwtToken;
    } catch (err) {
      return false;
    }
  }
}

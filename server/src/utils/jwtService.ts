import {
  injectable
} from "inversify";

import jwt from "jsonwebtoken";

import config from "../config/config";

interface AccessTokenPayload {
  userId: string;
  email: string;
}

@injectable()
export class JwtService {

  async generateAccessToken(
    payload: AccessTokenPayload
  ): Promise<string> {
    return jwt.sign(
      payload,
      config.jwt.accessSecret,
      {
        expiresIn: "15m"
      }
    );
  }

  async verifyAccessToken(
    token: string
  ): Promise<AccessTokenPayload> {
    return jwt.verify(
      token,
      config.jwt.accessSecret
    ) as AccessTokenPayload;
  }
}
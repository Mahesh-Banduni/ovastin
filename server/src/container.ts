import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./types";
import {
  PrismaService
} from "./utils/prismaService";

import {
  MailService
} from "./utils/mail";

import {
  JwtService
} from "./utils/jwtService";

import {
  AuthRepository
} from "./modules/auth/auth.repository.js";

import {
  AuthService
} from "./modules/auth/auth.service.js";

import {
  AuthController
} from "./modules/auth/auth.controller.js";


export { TYPES };

const container = new Container();


// ─────────────────────────────────────────────
// Infrastructure
// ─────────────────────────────────────────────

container.bind<PrismaService>(
  TYPES.PrismaService
)
.to(PrismaService)
.inSingletonScope();


container.bind<MailService>(
  TYPES.MailService
)
.to(MailService)
.inSingletonScope();


container.bind<JwtService>(
  TYPES.JwtService
)
.to(JwtService)
.inSingletonScope();


// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────

container.bind<AuthRepository>(
  TYPES.AuthRepository
)
.to(AuthRepository)
.inSingletonScope();


container.bind<AuthService>(
  TYPES.AuthService
)
.to(AuthService)
.inSingletonScope();


container.bind<AuthController>(
  TYPES.AuthController
)
.to(AuthController)
.inSingletonScope();


export default container;
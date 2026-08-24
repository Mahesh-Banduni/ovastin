export const TYPES = {
  PrismaService: Symbol.for("PrismaService"),
  MailService: Symbol.for("MailService"),
  JwtService: Symbol.for("JwtService"),

  AuthRepository: Symbol.for("AuthRepository"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController")
} as const;
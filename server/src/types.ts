export const TYPES = {
  PrismaService: Symbol.for("PrismaService"),
  MailService: Symbol.for("MailService"),
  JwtService: Symbol.for("JwtService"),

  AuthRepository: Symbol.for("AuthRepository"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),

  ProjectRepository: Symbol.for("ProjectRepository"),
  ProjectService: Symbol.for("ProjectService"),
  ProjectController: Symbol.for("ProjectController"),

  ServiceRepository: Symbol.for("ServiceRepository"),
  ServiceService: Symbol.for("ServiceService"),
  ServiceController: Symbol.for("ServiceController"),

  DeveloperRepository: Symbol.for("DeveloperRepository"),
  DeveloperService: Symbol.for("DeveloperService"),
  DeveloperController: Symbol.for("DeveloperController"),

  AmenityRepository: Symbol.for("AmenityRepository"),
  AmenityService: Symbol.for("AmenityService"),
  AmenityController: Symbol.for("AmenityController"),

  AwardRepository: Symbol.for("AwardRepository"),
  AwardService: Symbol.for("AwardService"),
  AwardController: Symbol.for("AwardController"),

  ContactRepository: Symbol.for("ContactRepository"),
  ContactService: Symbol.for("ContactService"),
  ContactController: Symbol.for("ContactController"),

  ProfileRepository: Symbol.for("ProfileRepository"),
  ProfileService: Symbol.for("ProfileService"),
  ProfileController: Symbol.for("ProfileController"),
} as const;
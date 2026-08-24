import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./types";
import { PrismaService } from "./utils/prismaService";
import { MailService } from "./utils/mail";
import { JwtService } from "./utils/jwtService";

// Auth
import { AuthRepository } from "./modules/auth/auth.repository.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { AuthController } from "./modules/auth/auth.controller.js";

// Projects
import { ProjectRepository } from "./modules/projects/project.repository.js";
import { ProjectService } from "./modules/projects/project.service.js";
import { ProjectController } from "./modules/projects/project.controller.js";

// Services
import { ServiceRepository } from "./modules/services/service.repository.js";
import { ServiceService } from "./modules/services/service.service.js";
import { ServiceController } from "./modules/services/service.controller.js";

// Developers
import { DeveloperRepository } from "./modules/developers/developer.repository.js";
import { DeveloperService } from "./modules/developers/developer.service.js";
import { DeveloperController } from "./modules/developers/developer.controller.js";

// Amenities
import { AmenityRepository } from "./modules/amenities/amenity.repository.js";
import { AmenityService } from "./modules/amenities/amenity.service.js";
import { AmenityController } from "./modules/amenities/amenity.controller.js";

// Awards
import { AwardRepository } from "./modules/awards/award.repository.js";
import { AwardService } from "./modules/awards/award.service.js";
import { AwardController } from "./modules/awards/award.controller.js";

// Contact
import { ContactRepository } from "./modules/contact/contact.repository.js";
import { ContactService } from "./modules/contact/contact.service.js";
import { ContactController } from "./modules/contact/contact.controller.js";

// Profile
import { ProfileRepository } from "./modules/profile/profile.repository.js";
import { ProfileService } from "./modules/profile/profile.service.js";
import { ProfileController } from "./modules/profile/profile.controller.js";


export { TYPES };

const container = new Container();


// ─────────────────────────────────────────────
// Infrastructure
// ─────────────────────────────────────────────

container.bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
container.bind<MailService>(TYPES.MailService).to(MailService).inSingletonScope();
container.bind<JwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();


// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────

container.bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();


// ─────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────

container.bind<ProjectRepository>(TYPES.ProjectRepository).to(ProjectRepository).inSingletonScope();
container.bind<ProjectService>(TYPES.ProjectService).to(ProjectService).inSingletonScope();
container.bind<ProjectController>(TYPES.ProjectController).to(ProjectController).inSingletonScope();


// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────

container.bind<ServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository).inSingletonScope();
container.bind<ServiceService>(TYPES.ServiceService).to(ServiceService).inSingletonScope();
container.bind<ServiceController>(TYPES.ServiceController).to(ServiceController).inSingletonScope();


// ─────────────────────────────────────────────
// Developers
// ─────────────────────────────────────────────

container.bind<DeveloperRepository>(TYPES.DeveloperRepository).to(DeveloperRepository).inSingletonScope();
container.bind<DeveloperService>(TYPES.DeveloperService).to(DeveloperService).inSingletonScope();
container.bind<DeveloperController>(TYPES.DeveloperController).to(DeveloperController).inSingletonScope();


// ─────────────────────────────────────────────
// Amenities
// ─────────────────────────────────────────────

container.bind<AmenityRepository>(TYPES.AmenityRepository).to(AmenityRepository).inSingletonScope();
container.bind<AmenityService>(TYPES.AmenityService).to(AmenityService).inSingletonScope();
container.bind<AmenityController>(TYPES.AmenityController).to(AmenityController).inSingletonScope();


// ─────────────────────────────────────────────
// Awards
// ─────────────────────────────────────────────

container.bind<AwardRepository>(TYPES.AwardRepository).to(AwardRepository).inSingletonScope();
container.bind<AwardService>(TYPES.AwardService).to(AwardService).inSingletonScope();
container.bind<AwardController>(TYPES.AwardController).to(AwardController).inSingletonScope();


// ─────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────

container.bind<ContactRepository>(TYPES.ContactRepository).to(ContactRepository).inSingletonScope();
container.bind<ContactService>(TYPES.ContactService).to(ContactService).inSingletonScope();
container.bind<ContactController>(TYPES.ContactController).to(ContactController).inSingletonScope();


// ─────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────

container.bind<ProfileRepository>(TYPES.ProfileRepository).to(ProfileRepository).inSingletonScope();
container.bind<ProfileService>(TYPES.ProfileService).to(ProfileService).inSingletonScope();
container.bind<ProfileController>(TYPES.ProfileController).to(ProfileController).inSingletonScope();


export default container;
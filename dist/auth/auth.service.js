"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const devices_service_1 = require("../devices/devices.service");
const auth_identity_entity_1 = require("./entities/auth-identity.entity");
const provider_token_verifier_service_1 = require("./provider-token-verifier.service");
let AuthService = class AuthService {
    usersService;
    devicesService;
    jwtService;
    providerTokenVerifier;
    identitiesRepository;
    constructor(usersService, devicesService, jwtService, providerTokenVerifier, identitiesRepository) {
        this.usersService = usersService;
        this.devicesService = devicesService;
        this.jwtService = jwtService;
        this.providerTokenVerifier = providerTokenVerifier;
        this.identitiesRepository = identitiesRepository;
    }
    async providerLogin(dto) {
        const verifiedIdentity = await this.providerTokenVerifier.verify(dto.provider, dto.idToken);
        let identity = await this.identitiesRepository.findOne({
            where: {
                provider: verifiedIdentity.provider,
                providerSubject: verifiedIdentity.subject,
            },
            relations: { user: true },
        });
        let isNewAccount = false;
        let user = identity?.user;
        if (!user) {
            if (!verifiedIdentity.email) {
                throw new common_1.UnauthorizedException('Apple token does not contain an email for a new account');
            }
            const existingUser = await this.usersService.findByEmail(verifiedIdentity.email);
            if (existingUser) {
                user = existingUser;
            }
            else {
                user = await this.usersService.create({
                    email: verifiedIdentity.email,
                });
                isNewAccount = true;
            }
            identity = this.identitiesRepository.create({
                userId: user.id,
                provider: verifiedIdentity.provider,
                providerSubject: verifiedIdentity.subject,
            });
            await this.identitiesRepository.save(identity);
        }
        const device = await this.devicesService.upsertForUser(user.id, {
            clientDeviceId: dto.clientDeviceId,
            platform: dto.platform,
            appVersion: dto.appVersion,
            publicKey: dto.publicKey,
        });
        return {
            accessToken: await this.signToken(user.id, device.id, user.email),
            user: { id: user.id, email: user.email, retrievalOptIn: user.retrievalOptIn },
            device: { id: device.id, clientDeviceId: device.clientDeviceId },
            isNewAccount,
        };
    }
    signToken(userId, deviceId, email) {
        return this.jwtService.signAsync({
            sub: userId,
            deviceId,
            email,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(auth_identity_entity_1.AuthIdentity)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        devices_service_1.DevicesService,
        jwt_1.JwtService,
        provider_token_verifier_service_1.ProviderTokenVerifierService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map
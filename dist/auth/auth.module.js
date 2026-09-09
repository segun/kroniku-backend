"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const users_module_1 = require("../users/users.module");
const devices_module_1 = require("../devices/devices.module");
const jwt_strategy_1 = require("./jwt.strategy");
const auth_identity_entity_1 = require("./entities/auth-identity.entity");
const provider_token_verifier_service_1 = require("./provider-token-verifier.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            devices_module_1.DevicesModule,
            typeorm_1.TypeOrmModule.forFeature([auth_identity_entity_1.AuthIdentity]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const expiresIn = configService.get('JWT_EXPIRES_SECONDS', 60 * 60 * 24 * 30);
                    return {
                        secret: configService.get('JWT_SECRET', 'dev-secret'),
                        signOptions: { expiresIn },
                    };
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, provider_token_verifier_service_1.ProviderTokenVerifierService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../prisma/prisma.service");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    users;
    prisma;
    jwt;
    constructor(users, prisma, jwt) {
        this.users = users;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async validateUser(email, password) {
        const user = await this.users.findByEmail(email);
        if (!user || !user.is_active)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const ok = await argon2.verify(user.password_hash, password);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const urs = await this.prisma.user_roles.findMany({
            where: { user_id: user.user_id },
            include: { roles: true },
        });
        const roles = urs.map(r => r.roles.name);
        return { user, roles };
    }
    async login(email, password) {
        const { user, roles } = await this.validateUser(email, password);
        const payload = { sub: user.user_id, email: user.email, roles };
        const accessToken = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES ?? '1d',
        });
        return {
            accessToken,
            user: {
                userId: user.user_id,
                fullName: user.full_name,
                email: user.email,
                roles,
            },
        };
    }
    async register(data) {
        const existing = await this.users.findByEmail(data.email);
        if (existing) {
            throw new common_2.BadRequestException('El email ya está registrado');
        }
        const created = await this.users.create({
            fullName: data.fullName ?? data.email.split('@')[0],
            email: data.email,
            password: data.password,
            isActive: true,
            roles: ['CLIENT'],
        });
        const payload = { sub: created.user_id, email: created.email, roles: created.roles };
        const accessToken = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES ?? '1d',
        });
        return {
            accessToken,
            user: {
                userId: created.user_id,
                fullName: created.full_name,
                email: created.email,
                roles: created.roles,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = __importStar(require("argon2"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.users.findUnique({ where: { email } });
    }
    async list() {
        const users = await this.prisma.users.findMany({
            orderBy: { user_id: 'asc' },
            select: { user_id: true, full_name: true, email: true, is_active: true, created_at: true },
        });
        const userIds = users.map(u => u.user_id);
        const ur = await this.prisma.user_roles.findMany({
            where: { user_id: { in: userIds } },
            include: { roles: true },
        });
        const rolesByUser = new Map();
        ur.forEach(x => {
            const list = rolesByUser.get(x.user_id) ?? [];
            list.push(x.roles.name);
            rolesByUser.set(x.user_id, list);
        });
        return users.map(u => ({ ...u, roles: rolesByUser.get(u.user_id) ?? [] }));
    }
    async get(userId) {
        const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no existe');
        const roles = await this.prisma.user_roles.findMany({
            where: { user_id: userId },
            include: { roles: true },
        });
        return {
            ...user,
            roles: roles.map(r => r.roles.name),
        };
    }
    async create(data) {
        const exists = await this.prisma.users.findUnique({ where: { email: data.email } });
        if (exists)
            throw new common_1.BadRequestException('Email ya registrado');
        const hash = await argon2.hash(data.password);
        const user = await this.prisma.users.create({
            data: {
                full_name: data.fullName,
                email: data.email,
                password_hash: hash,
                is_active: data.isActive ?? true,
            },
        });
        const dbRoles = await this.prisma.roles.findMany({ where: { name: { in: data.roles } } });
        if (dbRoles.length !== data.roles.length)
            throw new common_1.BadRequestException('Uno o más roles no existen');
        await this.prisma.user_roles.createMany({
            data: dbRoles.map(r => ({ user_id: user.user_id, role_id: r.role_id })),
            skipDuplicates: true,
        });
        return this.get(user.user_id);
    }
    async update(userId, dto) {
        const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no existe');
        const data = {};
        if (dto.fullName !== undefined)
            data.full_name = dto.fullName;
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.isActive !== undefined)
            data.is_active = dto.isActive;
        if (dto.password)
            data.password_hash = await argon2.hash(dto.password);
        await this.prisma.users.update({ where: { user_id: userId }, data });
        if (dto.roles) {
            const dbRoles = await this.prisma.roles.findMany({ where: { name: { in: dto.roles } } });
            if (dbRoles.length !== dto.roles.length)
                throw new common_1.BadRequestException('Uno o más roles no existen');
            await this.prisma.user_roles.deleteMany({ where: { user_id: userId } });
            await this.prisma.user_roles.createMany({
                data: dbRoles.map(r => ({ user_id: userId, role_id: r.role_id })),
            });
        }
        return this.get(userId);
    }
    async remove(userId) {
        await this.prisma.user_roles.deleteMany({ where: { user_id: userId } });
        await this.prisma.users.delete({ where: { user_id: userId } });
        return { ok: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map
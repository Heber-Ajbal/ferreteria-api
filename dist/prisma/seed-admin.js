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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    const baseRoles = ['ADMIN', 'CASHIER', 'INVENTORY', 'VIEWER'];
    for (const name of baseRoles) {
        await prisma.roles.upsert({
            where: { name },
            update: {},
            create: { name, description: name },
        });
    }
    const email = 'admin@local';
    const fullName = 'Admin';
    const password = 'Admin123*';
    const hash = await argon2.hash(password);
    const admin = await prisma.users.upsert({
        where: { email },
        update: {},
        create: {
            full_name: fullName,
            email,
            password_hash: hash,
            is_active: true,
        },
    });
    const adminRole = await prisma.roles.findUnique({ where: { name: 'ADMIN' } });
    if (adminRole) {
        await prisma.user_roles.upsert({
            where: { user_id_role_id: { user_id: admin.user_id, role_id: adminRole.role_id } },
            update: {},
            create: { user_id: admin.user_id, role_id: adminRole.role_id },
        });
    }
    console.log('✅ Admin listo:', email, '(pass:', password, ')');
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-admin.js.map
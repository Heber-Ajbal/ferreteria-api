import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly users;
    private readonly prisma;
    private readonly jwt;
    constructor(users: UsersService, prisma: PrismaService, jwt: JwtService);
    validateUser(email: string, password: string): Promise<{
        user: {
            created_at: Date;
            user_id: number;
            email: string;
            full_name: string;
            password_hash: string;
            is_active: boolean;
        };
        roles: string[];
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            userId: number;
            fullName: string;
            email: string;
            roles: string[];
        };
    }>;
    register(data: {
        fullName?: string;
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        user: {
            userId: number;
            fullName: string;
            email: string;
            roles: string[];
        };
    }>;
}

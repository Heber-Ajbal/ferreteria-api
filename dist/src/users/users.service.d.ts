import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
        is_active: boolean;
    } | null>;
    list(): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        is_active: boolean;
    }[]>;
    get(userId: number): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
        is_active: boolean;
    }>;
    create(data: {
        fullName: string;
        email: string;
        password: string;
        isActive?: boolean;
        roles: string[];
    }): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
        is_active: boolean;
    }>;
    update(userId: number, dto: {
        fullName?: string;
        email?: string;
        password?: string;
        isActive?: boolean;
        roles?: string[];
    }): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
        is_active: boolean;
    }>;
    remove(userId: number): Promise<{
        ok: boolean;
    }>;
}

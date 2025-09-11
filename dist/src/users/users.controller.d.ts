import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    list(): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        is_active: boolean;
    }[]>;
    get(id: number): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
        is_active: boolean;
    }>;
    create(dto: CreateUserDto): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
        is_active: boolean;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        roles: string[];
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
        is_active: boolean;
    }>;
    remove(id: number): Promise<{
        ok: boolean;
    }>;
}

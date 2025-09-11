import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            userId: number;
            fullName: string;
            email: string;
            roles: string[];
        };
    }>;
    profile(req: any): any;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            userId: number;
            fullName: string;
            email: string;
            roles: string[];
        };
    }>;
}

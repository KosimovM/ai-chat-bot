import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
}

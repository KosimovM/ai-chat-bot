import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateProfile(req: any, dto: UpdateUserDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

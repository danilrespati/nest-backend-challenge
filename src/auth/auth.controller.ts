import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// We'll use a local guard or just manual validation for simplicity first, or standard Passport extraction

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        // For a real app, use LocalAuthGuard (passport-local). 
        // For simplicity here, manual validation or just assuming req has credentials if we don't implement LocalStrategy.
        // But let's use the service method directly if we pass credentials in body.
        const user = await this.authService.validateUser(req.username, req.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() user) {
        return this.authService.register(user);
    }
}

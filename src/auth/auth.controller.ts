import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  profile(@Req() req: any) {
    return req.user; // { userId, email, roles }
  }

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register({
      fullName: dto.fullName,
      email: dto.email,
      password: dto.password,
    });
  }
}

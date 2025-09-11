import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.is_active) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await argon2.verify(user.password_hash, password);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    // roles
    const urs = await this.prisma.user_roles.findMany({
      where: { user_id: user.user_id },
      include: { roles: true },
    });
    const roles = urs.map(r => r.roles.name);
    return { user, roles };
  }

  async login(email: string, password: string) {
    const { user, roles } = await this.validateUser(email, password);
    const payload = { sub: user.user_id, email: user.email, roles };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES ?? '1d',
    });
    return {
      accessToken,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        roles,
      },
    };
  }

  async register(data: { fullName?: string; email: string; password: string }) {
  const existing = await this.users.findByEmail(data.email);
  if (existing) {
    throw new BadRequestException('El email ya está registrado');
  }

  // Crea el usuario con rol CLIENT y password hasheado (lo hace UsersService.create)
  const created = await this.users.create({
    fullName: data.fullName ?? data.email.split('@')[0],
    email: data.email,
    password: data.password,
    isActive: true,
    roles: ['CLIENT'],
  });

  // Arma payload igual que en login
  const payload = { sub: created.user_id, email: created.email, roles: created.roles };
  const accessToken = await this.jwt.signAsync(payload, {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES ?? '1d',
  });

  return {
    accessToken,
    user: {
      userId: created.user_id,
      fullName: created.full_name,
      email: created.email,
      roles: created.roles,
    },
  };
}

}

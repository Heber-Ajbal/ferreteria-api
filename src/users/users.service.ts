import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async list() {
    const users = await this.prisma.users.findMany({
      orderBy: { user_id: 'asc' },
      select: { user_id: true, full_name: true, email: true, is_active: true, created_at: true },
    });
    // roles por usuario
    const userIds = users.map(u => u.user_id);
    const ur = await this.prisma.user_roles.findMany({
      where: { user_id: { in: userIds } },
      include: { roles: true },
    });
    const rolesByUser = new Map<number, string[]>();
    ur.forEach(x => {
      const list = rolesByUser.get(x.user_id) ?? [];
      list.push(x.roles.name);
      rolesByUser.set(x.user_id, list);
    });
    return users.map(u => ({ ...u, roles: rolesByUser.get(u.user_id) ?? [] }));
  }

  async get(userId: number) {
    const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('Usuario no existe');
    const roles = await this.prisma.user_roles.findMany({
      where: { user_id: userId },
      include: { roles: true },
    });
    return {
      ...user,
      roles: roles.map(r => r.roles.name),
    };
  }

  async create(data: { fullName: string; email: string; password: string; isActive?: boolean; roles: string[] }) {
    const exists = await this.prisma.users.findUnique({ where: { email: data.email } });
    if (exists) throw new BadRequestException('Email ya registrado');

    const hash = await argon2.hash(data.password);

    const user = await this.prisma.users.create({
      data: {
        full_name: data.fullName,
        email: data.email,
        password_hash: hash,
        is_active: data.isActive ?? true,
      },
    });

    // asegurar roles existen
    const dbRoles = await this.prisma.roles.findMany({ where: { name: { in: data.roles } } });
    if (dbRoles.length !== data.roles.length) throw new BadRequestException('Uno o más roles no existen');

    await this.prisma.user_roles.createMany({
      data: dbRoles.map(r => ({ user_id: user.user_id, role_id: r.role_id })),
      skipDuplicates: true,
    });

    return this.get(user.user_id);
  }

  async update(userId: number, dto: { fullName?: string; email?: string; password?: string; isActive?: boolean; roles?: string[] }) {
    const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('Usuario no existe');

    const data: any = {};
    if (dto.fullName !== undefined) data.full_name = dto.fullName;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.isActive !== undefined) data.is_active = dto.isActive;
    if (dto.password) data.password_hash = await argon2.hash(dto.password);

    await this.prisma.users.update({ where: { user_id: userId }, data });

    if (dto.roles) {
      const dbRoles = await this.prisma.roles.findMany({ where: { name: { in: dto.roles } } });
      if (dbRoles.length !== dto.roles.length) throw new BadRequestException('Uno o más roles no existen');
      // limpia y asigna
      await this.prisma.user_roles.deleteMany({ where: { user_id: userId } });
      await this.prisma.user_roles.createMany({
        data: dbRoles.map(r => ({ user_id: userId, role_id: r.role_id })),
      });
    }
    return this.get(userId);
  }

  async remove(userId: number) {
    await this.prisma.user_roles.deleteMany({ where: { user_id: userId } });
    await this.prisma.users.delete({ where: { user_id: userId } });
    return { ok: true };
  }
}

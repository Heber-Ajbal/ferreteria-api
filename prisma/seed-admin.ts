import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // asegura roles
  const baseRoles = ['ADMIN','CASHIER','INVENTORY','VIEWER'];
  for (const name of baseRoles) {
    await prisma.roles.upsert({
      where: { name },
      update: {},
      create: { name, description: name },
    });
  }

  const email = 'admin@local';
  const fullName = 'Admin';
  const password = 'Admin123*';
  const hash = await argon2.hash(password);

  const admin = await prisma.users.upsert({
    where: { email },
    update: {},
    create: {
      full_name: fullName,
      email,
      password_hash: hash,
      is_active: true,
    },
  });

  const adminRole = await prisma.roles.findUnique({ where: { name: 'ADMIN' } });
  if (adminRole) {
    await prisma.user_roles.upsert({
      where: { user_id_role_id: { user_id: admin.user_id, role_id: adminRole.role_id } },
      update: {},
      create: { user_id: admin.user_id, role_id: adminRole.role_id },
    } as any); // si la PK compuesta se llama distinto, puedes hacer createMany con skipDuplicates
  }

  console.log('✅ Admin listo:', email, '(pass:', password, ')');
}
main().finally(() => prisma.$disconnect());

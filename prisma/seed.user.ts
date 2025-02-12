import { PrismaClient, Service } from '@prisma/client';

function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    const arrCopy: any[] = [];
    obj.forEach((val, i) => {
      arrCopy[i] = cloneDeep(val);
    });
    return arrCopy as T;
  }

  if (obj instanceof Object) {
    const objCopy: { [key: string]: any } = {};
    Object.keys(obj).forEach((key) => {
      objCopy[key] = cloneDeep((obj as { [key: string]: any })[key]);
    });
    return objCopy as T;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export const roles: Array<{ id?: number; name: string; isSystem?: boolean }> = [
  {
    id: 1,
    name: 'Admin',
    isSystem: true,
  },
  {
    id: 2,
    name: 'Manager',
  },
  {
    id: 3,
    name: 'User',
  },
  {
    id: 4,
    name: 'Vendor',
  },
];

export const permissions: Array<{
  id?: number;
  roleId: number;
  action: string;
  subject: string;
}> = [
    {
      id: 1,
      roleId: 1,
      action: 'manage',
      subject: 'all',
    },
    {
      id: 2,
      roleId: 2,
      action: 'manage',
      subject: 'user',
    },
    {
      id: 3,
      roleId: 4,
      action: 'manage',
      subject: 'user',
    },
    {
      id: 4,
      roleId: 3,
      action: 'read',
      subject: 'user',
    },
  ];

export const users: Array<{
  id?: number;
  name?: string;
  email?: string;
  wallet?: string;
}> = [
    {
      id: 1,
      name: 'Rumsan Admin',
      email: 'rumsan@mailinator.com',
      wallet: '0xAC6bFaf10e89202c293dD795eCe180BBf1430d7B',
    },


  ];

export const userRoles: Array<{
  id?: number;
  userId: number;
  roleId: number;
}> = [
    {
      id: 1,
      userId: 1,
      roleId: 1,
    },
  ];

export const auths: Array<{
  id?: number;
  userId: number;
  service: Service;
  serviceId: string;
}> = [
    {
      id: 1,
      userId: 1,
      service: Service.EMAIL,
      serviceId: 'rumsan@mailinator.com',
    },

  ];

const projectTypes: Array<{
  id?: number;
  name: string;
  description?: string;
}> = [
    {
      id: 1,
      name: 'aa',
    },
    {
      id: 2,
      name: 'cva',
    },
    {
      id: 3,
      name: 'el',
    },
    {
      id: 3,
      name: 'c2c',
    },
  ];

const prisma = new PrismaClient();

async function main() {
  // await prisma.$transaction([
  // 	prisma.permission.deleteMany(),
  // 	prisma.user.deleteMany(),
  // 	prisma.role.deleteMany(),
  // ]);
  // ===========Create Roles=============
  for await (const role of roles) {
    const roleAttrs = cloneDeep(role);
    delete roleAttrs.id;
    await prisma.role.upsert({
      where: {
        id: role.id,
      },
      create: roleAttrs,
      update: roleAttrs,
    });
  }

  // ===========Create Permissions==========
  for await (const permission of permissions) {
    const permissionAttrs = cloneDeep(permission);
    delete permissionAttrs.id;
    await prisma.permission.upsert({
      where: {
        id: permission.id,
      },
      create: permissionAttrs,
      update: permissionAttrs,
    });
  }

  // ==============Create Users===============
  for await (const user of users) {
    const userAttrs = cloneDeep(user);
    delete userAttrs.id;
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: userAttrs,
      update: userAttrs,
    });
  }

  // ==============Create Auths===============
  for await (const auth of auths) {
    const authAttrs = cloneDeep(auth);
    delete authAttrs.id;
    await prisma.auth.upsert({
      where: {
        id: auth.id,
      },
      create: authAttrs,
      update: authAttrs,
    });
  }

  // ==============Create User Roles===============
  for await (const userRole of userRoles) {
    const userRoleAttrs = cloneDeep(userRole);
    delete userRoleAttrs.id;
    await prisma.userRole.upsert({
      where: {
        id: userRole.id,
      },
      create: userRoleAttrs,
      update: userRoleAttrs,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
  });

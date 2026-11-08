import { eq, and, isNull } from "drizzle-orm";
import { db } from "../../lib/db";
import { users, roles, type User, type Role } from "../../lib/schema";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [result] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)));
    return result || null;
  }

  async findRoleById(roleId: number): Promise<Role | null> {
    const [result] = await db.select().from(roles).where(eq(roles.id, roleId));
    return result || null;
  }

  async findRoleByName(name: string): Promise<Role | null> {
    const [result] = await db.select().from(roles).where(eq(roles.name, name));
    return result || null;
  }

  async insertUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    roleId: number;
    departmentId?: number | null;
    nip?: string | null;
    jabatan?: string | null;
  }): Promise<User> {
    const [inserted] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      roleId: data.roleId,
      departmentId: data.departmentId || null,
      nip: data.nip || null,
      jabatan: data.jabatan || null,
    });

    const [user] = await db.select().from(users).where(eq(users.id, inserted.insertId));
    if (!user) {
      throw new Error("Failed to retrieve created user");
    }
    return user;
  }
}

export const userRepository = new UserRepository();

import "dotenv/config";
import bcrypt from "bcrypt";
import { db, poolConnection } from "./db";
import { roles, departments, users } from "./schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Seed Roles
    const initialRoles = [
      { name: "admin", description: "System Administrator" },
      { name: "tu", description: "Tata Usaha" },
      { name: "kepala_sekolah", description: "Kepala Sekolah" },
      { name: "kepala_unit", description: "Kepala Unit Kerja / Wakasek" },
      { name: "guru_staf", description: "Guru dan Staf Sekolah" },
    ];

    for (const role of initialRoles) {
      const existing = await db.select().from(roles).where(eq(roles.name, role.name));
      if (existing.length === 0) {
        await db.insert(roles).values(role);
        console.log(`✓ Seeded role: ${role.name}`);
      }
    }

    // 2. Seed Departments
    const initialDepartments = [
      { name: "Tata Usaha" },
      { name: "Kurikulum" },
      { name: "Kesiswaan" },
      { name: "Sarpras" },
      { name: "Humas" },
      { name: "BK" },
      { name: "Perpustakaan" },
    ];

    for (const dept of initialDepartments) {
      const existing = await db.select().from(departments).where(eq(departments.name, dept.name));
      if (existing.length === 0) {
        await db.insert(departments).values(dept);
        console.log(`✓ Seeded department: ${dept.name}`);
      }
    }

    // 3. Seed Default Admin
    const [adminRole] = await db.select().from(roles).where(eq(roles.name, "admin"));
    const [tuDept] = await db.select().from(departments).where(eq(departments.name, "Tata Usaha"));

    if (adminRole) {
      const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@gmail.com"));
      if (existingAdmin.length === 0) {
        const passwordHash = await bcrypt.hash("admin123", 10);
        await db.insert(users).values({
          name: "admin",
          email: "admin@gmail.com",
          passwordHash,
          roleId: adminRole.id,
          departmentId: tuDept ? tuDept.id : null,
          jabatan: "Administrator",
        });
        console.log("✓ Seeded default admin user (email: admin@gmail.com, pass: admin123)");
      } else {
        console.log("ℹ Default admin already exists.");
      }
    }

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await poolConnection.end();
  }
}

// Run direct if invoked from CLI
if (import.meta.main) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}


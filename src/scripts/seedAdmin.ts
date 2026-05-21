import "dotenv/config";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    console.log("***** Admin Seeding Started....");

    const adminData = {
      name: "Admin",
      email: "admin@skillbridge.com",
      password: "admin123456",
    };

    console.log("***** Checking if Admin exists...");

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("Admin already exists!");
      return;
    }

    console.log("***** Creating admin via Better Auth...");

    const response = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: process.env.BETTER_AUTH_URL!,
        },
        body: JSON.stringify(adminData),
      },
    );

    const result = await response.json();
    console.log("Sign-up response:", JSON.stringify(result, null, 2));

    if (!response.ok) {
      throw new Error(`Sign-up failed: ${JSON.stringify(result)}`);
    }

    // Update role to admin
    await prisma.user.update({
      where: { email: adminData.email },
      data: { role: "admin" },
    });

    console.log("******* SUCCESS ******");
    console.log("   Email:    admin@skillbridge.com");
    console.log("   Password: admin123456");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();

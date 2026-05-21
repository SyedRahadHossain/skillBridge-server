import "dotenv/config";
import { prisma } from "../lib/prisma";

const categories = [
    { name: "Mathematics", icon: "📐" },
    { name: "Physics", icon: "⚛️" },
    { name: "Chemistry", icon: "🧪" },
    { name: "Biology", icon: "🧬" },
    { name: "English", icon: "📖" },
    { name: "History", icon: "🏛️" },
    { name: "Geography", icon: "🌍" },
    { name: "Computer Science", icon: "💻" },
    { name: "Programming", icon: "🖥️" },
    { name: "Economics", icon: "📊" }
];

async function seedCategories() {
    try {
        console.log("***** Category Seeding Started....");

        for (const cat of categories) {
            await prisma.category.upsert({
                where: { name: cat.name },
                update: {},
                create: cat
            });
        }

        console.log(`******* ${categories.length} categories seeded successfully! ******`);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

seedCategories();

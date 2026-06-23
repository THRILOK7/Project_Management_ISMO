import prisma from './src/utils/prisma';

async function main() {
  try {
    await prisma.auditLog.create({
      data: {
        userId: "test-user-id",
        action: "TEST",
        details: "Test detail",
      }
    });
    console.log("AuditLog inserted successfully");
  } catch (e: any) {
    console.error("ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

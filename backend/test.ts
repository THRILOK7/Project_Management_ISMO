import prisma from './src/utils/prisma';

async function main() {
  try {
    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      where: { project: { userId: 'some-user-id' } },
      _count: true,
    });
    console.log(taskStats);
  } catch (e: any) {
    console.error("ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

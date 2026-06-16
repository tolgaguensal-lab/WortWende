import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const vocab = await prisma.vocabulary.count({ where: { isPublished: true } });
  const grammar = await prisma.grammarTopic.count({ where: { isPublished: true } });
  
  console.log('Vokabeln:', vocab);
  console.log('Grammatik-Topics:', grammar);
  
  // Breakdown by level
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  console.log('\nVokabeln nach Level:');
  for (const level of levels) {
    const count = await prisma.vocabulary.count({ 
      where: { isPublished: true, level: level as any } 
    });
    console.log(`  ${level}: ${count}`);
  }
  
  console.log('\nGrammatik nach Level:');
  for (const level of levels) {
    const count = await prisma.grammarTopic.count({ 
      where: { isPublished: true, level: level as any } 
    });
    console.log(`  ${level}: ${count}`);
  }
  
  await prisma.$disconnect();
}

main();

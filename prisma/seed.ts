import { prisma } from "../src/lib/prisma";

const BOARDS = [
  { slug: "free", name: "자유게시판", type: "FREE" as const },
  { slug: "sedan", name: "세단", type: "CAR_MODEL" as const },
  { slug: "suv", name: "SUV", type: "CAR_MODEL" as const },
  { slug: "ev", name: "전기차", type: "CAR_MODEL" as const },
  { slug: "truck", name: "트럭/상용차", type: "CAR_MODEL" as const },
];

async function main() {
  for (const board of BOARDS) {
    await prisma.board.upsert({
      where: { slug: board.slug },
      update: { name: board.name, type: board.type },
      create: board,
    });
  }
  console.log(`${BOARDS.length}개 게시판 시드 완료`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

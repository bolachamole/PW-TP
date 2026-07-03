import prisma from "../utils/prismaClient.js";

export async function saveScore(userId: string, score: number) {
  return prisma.gameSessions.create({
    data: { userId, score },
  });
}

export async function getRanking() {
  const topScores = await prisma.gameSessions.groupBy({
    by: ["userId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    take: 10,
  });

  const userIds = topScores.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u.name]));

  return topScores.map((r, i) => ({
    posicao: i + 1,
    nome: userMap.get(r.userId) ?? "Desconhecido",
    pontuacao: r._max.score ?? 0,
  }));
}

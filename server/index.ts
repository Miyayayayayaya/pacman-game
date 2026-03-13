import express from 'express';
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const app = express();
app.use(cors()); // Viteからのアクセスを許可
app.use(express.json());

// Prismaのセットアップ（先ほど作ったロジックをここに移植）
const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// スコア送信 API
app.post('/api/ranking', async (req, res) => {
  const { userName, score, stage } = req.body;
  try {
    const record = await prisma.ranking.create({
      data: { userName, score, stage }
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "保存失敗" });
  }
});

// ランキング取得 API
app.get('/api/ranking/:stage', async (req, res) => {
  const stage = parseInt(req.params.stage);
  const data = await prisma.ranking.findMany({
    where: { stage },
    orderBy: { score: 'asc' },
    take: 10
  });
  res.json(data);
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
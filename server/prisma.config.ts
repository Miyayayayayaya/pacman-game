import "dotenv/config";
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations:{
        path: "prisma/migrations",
    },
    datasource: {
    // ここに接続先を記述します
        url: env("DATABASE_URL"),
    },
});
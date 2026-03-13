// src/api/ranking.ts (Viteプロジェクト内)

const API_URL = 'http://localhost:3001/api/ranking';

/**
 * スコアをサーバーに送信する
 * @param userName プレイヤー名
 * @param score タイム（小数点5桁想定）
 * @param stage ステージ番号 (1, 2, 0=Total)
 */
export const submitScore = async (userName: string, score: number, stage: number) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, score, stage }),
    });

    if (!response.ok) throw new Error('送信に失敗しました');
    
    const result = await response.json();
    console.log('保存成功:', result);
    return result;
  } catch (error) {
    console.error('通信エラー:', error);
  }
};

/**
 * ランキングデータを取得する
 */
export const fetchRankings = async (stage: number) => {
  const response = await fetch(`${API_URL}/${stage}`);
  return await response.json();
};
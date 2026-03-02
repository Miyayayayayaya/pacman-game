
export type GameStatus = 'PLAYING'|'CLEAR'|'GAMEOVER'|'READY';

export type GameState = {
    isGaming: boolean;
    status:GameStatus;
}
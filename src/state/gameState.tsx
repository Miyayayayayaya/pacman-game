
export type GameStatus = 'PLAYING'|'CLEAR'|'GAMEOVER'|'READY';

export type GameState = {
    isGaming: boolean;
    stage:number;
    status:GameStatus;
}
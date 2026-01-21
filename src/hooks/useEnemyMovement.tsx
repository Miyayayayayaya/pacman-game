import React, { useEffect } from "react";
import type { GameState } from "../state/gameState";
interface EnemyPosition{
    x:number,
    y:number,
    lastDir:{x:number,y:number},
}
type EnemyMovementProps={
    gameState:GameState;
    setGameSize:{x:number,y:number};
    gameBoard:number[][];
    setEnemyPos:React.Dispatch<React.SetStateAction<EnemyPosition>>;
}
export default function useEnemyMovement({
    gameState,setGameSize,gameBoard,setEnemyPos,
}:EnemyMovementProps){
    useEffect(()=>{
    if(!gameState.isGaming) return;
    const enemyMoveInterval=setInterval(()=>{
        setEnemyPos((prev:EnemyPosition)=>{
            const directions=[
                {x:0,y:1},
                {x:0,y:-1},
                {x:1,y:0},
                {x:-1,y:0},
            ];
            const availableMoves=directions.filter((dir)=>{
                const nX=prev.x+dir.x;
                const nY=prev.y+dir.y;
                const isPath=nY>=0&&nY<setGameSize.y&&nX>=0&&nX<setGameSize.x&&gameBoard[nY][nX]!==1;
                const isNotReverse=!(dir.x===-prev.lastDir.x&&dir.y===-prev.lastDir.y);
                return isPath&&isNotReverse;
            })
            const finalMoves=availableMoves.length>0?availableMoves:directions.filter(d=>{
                const nX=prev.x+d.x;
                const nY=prev.y+d.y;
                return nY >= 0 && nY < setGameSize.y && nX >= 0 && nX < setGameSize.x && gameBoard[nY][nX] !== 1;
            })
            if(finalMoves.length>0){
                const choice=finalMoves[Math.floor(Math.random()*finalMoves.length)];
                return {x:prev.x+choice.x,y:prev.y+choice.y,lastDir:choice};
            }
            return prev;
        });
    },50);
    return ()=>clearInterval(enemyMoveInterval);
    },[gameState.isGaming,gameBoard,setEnemyPos,setGameSize])
}
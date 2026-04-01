import React, { useEffect, useRef } from "react";
import type { GameState } from "../state/gameState";
interface EnemyPosition{
    x:number,
    y:number,
    lastDir:{x:number,y:number},
}
type PlayerPosition={
    x:number,
    y:number,
}
type EnemyMovementProps={
    gameState:GameState;
    setGameSize:{x:number,y:number};
    gameBoard:number[][];
    setEnemyPos:React.Dispatch<React.SetStateAction<EnemyPosition>>;
    playerPos:PlayerPosition;
    onCollision:()=>void;
}
export default function useEnemyMovement({
    gameState,setGameSize,gameBoard,setEnemyPos,playerPos,onCollision,
}:EnemyMovementProps){
    const gameBoardRef = useRef(gameBoard);
    const playerPosRef = useRef(playerPos);

    useEffect(()=>{
        gameBoardRef.current = gameBoard;
    },[gameBoard]);

    useEffect(()=>{
        playerPosRef.current = playerPos;
    },[playerPos]);

    useEffect(()=>{
    if(!gameState.isGaming) return;
    const enemyMoveInterval=setInterval(()=>{
        setEnemyPos((prev:EnemyPosition)=>{
            const currentBoard = gameBoardRef.current;
            const currentPlayerPos = playerPosRef.current;
            const directions=[
                {x:0,y:1},
                {x:0,y:-1},
                {x:1,y:0},
                {x:-1,y:0},
            ];
            const availableMoves=directions.filter((dir)=>{
                const nX=prev.x+dir.x;
                const nY=prev.y+dir.y;
                const isPath= nY >= 0 && nY < setGameSize.y && nX >= 0 && nX < setGameSize.x && currentBoard[nY][nX] !== 1;
                const isNotReverse=!(dir.x===-prev.lastDir.x&&dir.y===-prev.lastDir.y);
                return isPath&&isNotReverse;
            })
            const finalMoves=availableMoves.length>0?availableMoves:directions.filter(d=>{
                const nX=prev.x+d.x;
                const nY=prev.y+d.y;
                return nY >= 0 && nY < setGameSize.y && nX >= 0 && nX < setGameSize.x && currentBoard[nY][nX] !== 1;
            })
            if(finalMoves.length>0){
                const choice=finalMoves[Math.floor(Math.random()*finalMoves.length)];
                const nextX=prev.x+choice.x;
                const nextY=prev.y+choice.y;
                if (nextX===currentPlayerPos.x && nextY===currentPlayerPos.y){
                    onCollision();
                }
                return {x:nextX,y:nextY,lastDir:choice};
            }
            return prev;
        });
    },200);
    return ()=>clearInterval(enemyMoveInterval);
    },[gameState.isGaming,onCollision,setEnemyPos,setGameSize])
}
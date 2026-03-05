import { useEffect, useState } from 'react';
import styles from './App.module.css';
import WallCoords from './utils/SetWall';
import ItemCoords from './utils/SetItem';
import CountItem from './utils/CountItem';
import type { GameState } from './state/gameState';
import useEnemyMovement from './hooks/useEnemyMovement';

const makeGameBoard=(width:number,height:number):number[][]=>{
  const twoDimensionalArray:number[][]=Array.from({length:height},()=>Array.from({length:width},()=>0),);
  WallCoords({twoDimensionalArray})
  ItemCoords({twoDimensionalArray})
  return twoDimensionalArray;
}
const setGameSize={
  x:15,
  y:15,
}
type Direction='UP'|'DOWN'|'RIGHT'|'LEFT'|'STOP';
function App() {
  const [gameBoard, setGameBoard]=useState<number[][]>(makeGameBoard(setGameSize.y,setGameSize.x));
  // [0]:通路 [1]:壁 [2]:アイテム
  const [pos,setPos]=useState({x:1,y:1});
  const [dir,setDir]=useState<Direction>('STOP')
  const [enemyPos,setEnemyPos]=useState({x:7,y:7,lastDir:{x:0,y:0}})
  const [gameState,setGameState]=useState<GameState>({
    isGaming:false,
    status:'READY',
  })
  const [time,setTime]=useState(0);
  const resetGame=()=>{
    setGameBoard(makeGameBoard(setGameSize.x,setGameSize.y));
    setPos({x:1,y:1});
    setEnemyPos({x:7,y:7,lastDir:{x:0,y:0}});
    setDir('STOP');
    setTime(0);
    setGameState({isGaming:false,status:'READY'});
  }
  useEffect(()=>{
    let timerId: ReturnType<typeof setInterval>;
    if(gameState.isGaming){
      timerId=setInterval(()=>{
        setTime((prev)=>prev+1);
      },100);
    }
    return ()=>{
      if(timerId) clearInterval(timerId);
    }
  },[gameState.isGaming]);
  useEffect(()=>{
    const remainingItems=gameBoard.flat().filter(cell=>cell===2).length;
    if(gameState.isGaming&&remainingItems===0){
      setGameState({isGaming:false,status:'CLEAR'});
    }
  },[gameBoard,gameState.isGaming]);
  useEffect(()=>{
    if(pos.x===enemyPos.x&&pos.y===enemyPos.y&&gameState.isGaming){
      setGameState({isGaming:false,status:'GAMEOVER'});
    }
  },[pos,enemyPos,gameState.isGaming]);
  useEffect(()=>{
    const handleKeyDown=(e:KeyboardEvent)=>{
      const isArrowKey=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)
      if(isArrowKey){
        e.preventDefault();
        setGameState(prev=>{
          if(prev.isGaming) return prev;
          return {...prev,isGaming:true}
        });
      }
      switch(e.key){
        case 'ArrowUp': setDir('UP'); break;
        case 'ArrowDown': setDir('DOWN'); break;
        case 'ArrowLeft': setDir('LEFT'); break;;
        case 'ArrowRight': setDir('RIGHT'); break;
      };
    };
    window.addEventListener('keydown',handleKeyDown);
    return()=>window.removeEventListener('keydown',handleKeyDown);
  },[])
  useEffect(()=>{
    if (dir==='STOP'||!gameState.isGaming) return;
    const moveInterval=setInterval(()=>{
      setPos((prev)=>{
        switch(dir){
          case 'UP':{
            const nextY=prev.y-1;
            const nextX=prev.x;
            if(gameBoard[nextY][nextX]===2){
              setGameBoard((prevBoard)=>{
                const newBoard=structuredClone(prevBoard);
                newBoard[nextY][nextX]=0;
                return newBoard
              })
            }
            if (prev.y > 1 && gameBoard[nextY][prev.x]!==1) return {...prev,y:prev.y-1};
            break;
          }
          case 'DOWN':{
            const nextY=prev.y+1;
            const nextX=prev.x
            if(gameBoard[nextY][nextX]===2){
              setGameBoard((prevBoard)=>{
                const newBoard=structuredClone(prevBoard);
                newBoard[nextY][nextX]=0;
                return newBoard
              })
            }
            if (prev.y < setGameSize.y-2 && gameBoard[nextY][prev.x]!==1) return {...prev,y:prev.y+1};
            
            break;
          }
          case 'LEFT':{
            const nextX=prev.x-1
            const nextY=prev.y;
            if(gameBoard[nextY][nextX]===2){
              setGameBoard((prevBoard)=>{
                const newBoard=structuredClone(prevBoard);
                newBoard[nextY][nextX]=0;
                return newBoard
              })
            }
            if (prev.x > 0 && gameBoard[prev.y][nextX]!==1) return {...prev,x:prev.x-1};
            break;
          }
          case 'RIGHT':{
            const nextX=prev.x+1;
            const nextY=prev.y
            if(gameBoard[nextY][nextX]===2){
              setGameBoard((prevBoard)=>{
                const newBoard=structuredClone(prevBoard);
                newBoard[nextY][nextX]=0;
                return newBoard
              })
            }
            if (prev.x < setGameSize.x-1 && gameBoard[prev.y][nextX]!==1) return {...prev,x:prev.x+1};
            break;
          }
        }
        return prev;
      });
    },100)
    return ()=> clearInterval(moveInterval)
  },[dir,gameBoard,gameState])
  useEnemyMovement({gameState,setGameSize,gameBoard,setEnemyPos})
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.timerDisplay}>
          TIME: {(time/10).toFixed(1)}s
        </div>
        <div className={styles.scoreBoard}>ITEMS: <CountItem twoDimensionalArray={gameBoard}/></div>
      </div>
      <div className={styles.board} style={{
        width:setGameSize.x*10,
        height:setGameSize.y*10,
        gridTemplateColumns: `repeat(${setGameSize.x},10px)`,
        gridTemplateRows:`repeat(${setGameSize.y},10px)`}}>
        {gameBoard.map((row,y)=>row.map((col,x)=>(
          <div className={styles.cell} key={`${x}-${y}`} style={{backgroundColor:col===1?'blue':'black'}}>
            {col===2&&<div className={styles.dot}/>}
          </div>
        )))}
        <div className={styles.character}
        style={{left:(pos.x)*10,top:(pos.y)*10,zIndex:10}}>
          👤
        </div>
        <div className={styles.character} style={{left:enemyPos.x*10,top:enemyPos.y*10,color:'red',zIndex:11}}>👾</div>
        {(gameState.status === 'CLEAR' || gameState.status === 'GAMEOVER') && (
          <div className={styles.overlay}>
            <div className={`${styles.resultTitle} ${
              gameState.status === 'CLEAR' ? styles.clearColor : styles.gameOverColor
            }`}>
              {gameState.status === 'CLEAR' ? 'STAGE CLEAR!' : 'GAME OVER'}
            </div>
            <button className={styles.retryButton} onClick={resetGame}>
              {gameState.status === 'CLEAR' ? 'NEXT STAGE' : 'TRY AGAIN'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

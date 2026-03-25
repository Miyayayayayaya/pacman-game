import { useEffect, useState, useCallback } from 'react';
import styles from './components/App.module.css';
import WallCoords from './utils/SetWall';
import ItemCoords from './utils/SetItem';
import CountItem from './utils/CountItem';
import type { GameState } from './state/gameState';
import useEnemyMovement from './hooks/useEnemyMovement';
import { useNavigate } from 'react-router-dom';
import { submitScore } from './api/ranking';

const makeGameBoard=(width:number,height:number, level:number):number[][]=>{
  const board =Array.from({length:height},()=>Array.from({length:width},()=>0));
  WallCoords({board, level});
  ItemCoords({board})
  return board;
}
const setGameSize={
  x:15,
  y:15,
}
const CELL_SIZE=30;
const MAX_STAGE=2;
type Direction='UP'|'DOWN'|'RIGHT'|'LEFT'|'STOP';
function App() {
  const [gameBoard, setGameBoard]=useState<number[][]>(makeGameBoard(setGameSize.y,setGameSize.x,1));
  // [0]:通路 [1]:壁 [2]:アイテム
  const [pos,setPos]=useState({x:1,y:1});
  const [dir,setDir]=useState<Direction>('STOP')
  const [enemyPos,setEnemyPos]=useState({x:7,y:7,lastDir:{x:0,y:0}})
  const [gameState,setGameState]=useState<GameState>({
    isGaming:false,
    stage:1,
    status:'READY',
  })
  const [userName, setUserName] = useState<string>('');
  const [isStarted,setIsStarted]=useState(false);
  const [time,setTime]=useState(0);
  const [stage1Time,setStage1Time]=useState<number|null>(null);
  const resetGame=()=>{
    console.log("Click reset")
    setGameBoard(makeGameBoard(setGameSize.x,setGameSize.y,gameState.stage));
    setPos({x:1,y:1});
    setEnemyPos({x:7,y:7,lastDir:{x:0,y:0}});
    setDir('STOP');
    setTime(0);
    setGameState({isGaming:false,stage:1,status:'READY'});
  }
  const nextStage =()=>{
    if(gameState.stage>=MAX_STAGE)return;
    const nextStage=gameState.stage+1
    setPos({ x: 1, y: 1 });
    setDir('STOP')
    setTime(0);
    setEnemyPos({ x: 7, y: 7, lastDir: { x: 0, y: 0 } });
    setGameBoard(makeGameBoard(setGameSize.x,setGameSize.y,nextStage));
    setGameState({ isGaming: false, stage:nextStage,status: 'READY' });
  }
  const navigate=useNavigate();
  const handleClear=useCallback(async(currentTime: number,currentStage:number)=>{
    if (!userName) return;
    const finalTimeInSeconds=currentTime/10;
    try{
      if(currentStage===1){
        setStage1Time(finalTimeInSeconds);
        await submitScore(userName,finalTimeInSeconds,1);
      } else if (currentStage===2){
        await submitScore(userName,finalTimeInSeconds,2);
        if (stage1Time!==null){
          await submitScore(userName,stage1Time+finalTimeInSeconds,0)
        }
      }
      console.log("Save successful");
    } catch (error) {
      console.log("Save failed:", error);
    }
  },[userName,stage1Time]);
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
      setGameState(prev=>({...prev,isGaming:false,status:'CLEAR'}));
      handleClear(time,gameState.stage);
    }
  },[gameBoard,gameState,time,handleClear]);
  useEffect(()=>{
    if(pos.x===enemyPos.x&&pos.y===enemyPos.y&&gameState.isGaming){
      setGameState({...gameState,isGaming:false,status:'GAMEOVER'});
    }
  },[pos,enemyPos,gameState]);
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
  if (!isStarted){
    return(
      <div className={styles.loginContainer}>
        <h1 className={styles.neonTitle}>PAC-MAN</h1>
        <div className={styles.loginBox}>
          <p>ENTER YOUR NAME</p>
          <input 
          type="text"
          maxLength={10}
          placeholder='NAME...'
          className={styles.nameInput}
          onKeyDown={(e)=>{
            if (e.key==='Enter'){
              const val=(e.target as HTMLInputElement).value.trim();
              if(val){
                setUserName(val);
                setIsStarted(true);
              }
            }
          }}
          />
          <p className={styles.hint}>PRESS ENTER TO START</p>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.timerDisplay}>
          TIME: {(time/10).toFixed(1)}s
        </div>
        <div className={styles.scoreBoard}>ITEMS: <CountItem twoDimensionalArray={gameBoard}/></div>
      </div>
      <div className={styles.board} style={{
        width:setGameSize.x*CELL_SIZE,
        height:setGameSize.y*CELL_SIZE,
        gridTemplateColumns: `repeat(${setGameSize.x},${CELL_SIZE}px)`,
        gridTemplateRows:`repeat(${setGameSize.y},${CELL_SIZE}px)`}}>
        {gameBoard.map((row,y)=>row.map((col,x)=>(
          <div className={styles.cell} key={`${x}-${y}`} style={{width: CELL_SIZE,height:CELL_SIZE,backgroundColor:col===1?'blue':'black'}}>
            {col===2&&<div className={styles.dot}/>}
          </div>
        )))}
        <div className={styles.character}
        style={{left:(pos.x)*CELL_SIZE,top:(pos.y)*CELL_SIZE,width:CELL_SIZE,height:CELL_SIZE,fontSize:`$${CELL_SIZE*0.8}px`,zIndex:10}}>
          🟡
        </div>
        <div className={styles.character} style={{left:enemyPos.x*CELL_SIZE,top:enemyPos.y*CELL_SIZE, width:CELL_SIZE,height:CELL_SIZE,fontSize:`${CELL_SIZE*0.8}px`,color:'red',zIndex:11}}>👾</div>
          {gameState.status==='CLEAR'&&(
            <div className={styles.overlay}>
              {gameState.stage<MAX_STAGE?(
                <div className={styles.clearContent}>
                  <div className={styles.clearText}>STAGE {gameState.stage} CLEAR</div>
                  <div className={styles.timeText}>TIME: {(time / 10).toFixed(5)}s</div>
                  <button className={styles.nextButton} onClick={nextStage}>NEXT STAGE</button>
                </div>
              ):(
                <div className={styles.allClearContainer}>
                  <div className={styles.finalScore}>
                    <p>STAGE {MAX_STAGE} TIME: {(time/10).toFixed(5)}s</p>
                  </div>
                  <div className={styles.autoSaveNote}>SCORES AUTO-SAVED</div>
                  <button className={styles.rankingButton} onClick={()=>navigate('/ranking')}>VIEW RANKING</button>
                </div>
              )
              }
            </div>
          )}
          {gameState.status==='GAMEOVER'&&(
            <div className={styles.overlay}>
              <div className={styles.gameOverText}>GAME OVER</div>
                <button className={styles.retryButton} onClick={()=>window.location.reload()}>RETRY</button>
              </div>
          )}
      </div>
    </div>
  )
}

export default App

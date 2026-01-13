import { useEffect, useState } from 'react';
import styles from './App.module.css';
// import { GameState } from './state/gameState';

const makeGameBoard=(width:number,height:number):number[][]=>{
  const twoDimensionalArray:number[][]=Array.from({length:height},()=>Array.from({length:width},()=>0),);
  twoDimensionalArray[5][5]=1
  return twoDimensionalArray;
}
const setGameSize={
  x:10,
  y:10,
}
type Direction='UP'|'DOWN'|'RIGHT'|'LEFT'|'STOP';
function App() {
  const [gameBoard, setGameBoard]=useState<number[][]>(makeGameBoard(setGameSize.y,setGameSize.x));
  const [pos,setPos]=useState({x:0,y:0});
  const [dir,setDir]=useState<Direction>('STOP')
  // const [gameState, setGameState]=useState<GameState>({isGaming:true})
  // if(gameState.isGaming){
  //   const makeWall=structuredClone(gameBoard)
  //   makeWall[5][5]=1;
  //   setGameBoard(makeWall);
  // }
  useEffect(()=>{
    const handleKeyDown=(e:KeyboardEvent)=>{
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
    if (dir==='STOP') return;
    const moveInterval=setInterval(()=>{
      setPos((prev)=>{
        switch(dir){
          case 'UP':{
            const nextY=prev.y-1;
            if (prev.y > 0 && gameBoard[nextY][prev.x]!==1) return {...prev,y:prev.y-1};
            break;
          }
          case 'DOWN':{
            const nextY=prev.y+1;
            if (prev.y < setGameSize.y-1 && gameBoard[nextY][prev.x]!==1) return {...prev,y:prev.y+1};
            break;
          }
          case 'LEFT':{
            const nextX=prev.x-1
            if (prev.x > 0 && gameBoard[prev.y][nextX]!==1) return {...prev,x:prev.x-1};
            break;
          }
          case 'RIGHT':{
            const nextX=prev.x+1;
            if (prev.x < setGameSize.x-1 && gameBoard[prev.y][nextX]!==1) return {...prev,x:prev.x+1};
            break;
          }
        }
        return prev;
      });
    },70)
    return ()=> clearInterval(moveInterval)
  },[dir,gameBoard])
  return (
    <div className={styles.container}>
      <div className={styles.board} style={{
        width:setGameSize.x*10,
        height:setGameSize.y*10,
        gridTemplateColumns: `repeat(${setGameSize.x},10px)`,
        gridTemplateRows:`repeat(${setGameSize.y},10px)`}}>
        {gameBoard.map((row,y)=>row.map((col,x)=>(
          <div className={styles.cell} key={`${x}-${y}`} style={{backgroundColor:col===1?'blue':'black'}}/>
        )))}
        <div className={styles.character}
        style={{left:(pos.x)*10,top:(pos.y)*10,zIndex:10}}>
          👤
        </div>
      </div>
    </div>
  )
}

export default App

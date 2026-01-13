import { useEffect, useState } from 'react';
import styles from './App.module.css';

const makeGameBoard=(width:number,height:number):number[][]=>{
  const twoDimensionalArray:number[][]=Array.from({length:height},()=>Array.from({length:width},()=>0),);
  return twoDimensionalArray;
}
type Direction='UP'|'DOWN'|'RIGHT'|'LEFT'|'STOP';
function App() {
  const [gameBoard, setGameBoard]=useState<number[][]>(makeGameBoard(30,30));
  const [pos,setPos]=useState({x:0,y:0});
  const [dir,setDir]=useState<Direction>('STOP')
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
          case 'UP': 
            if (prev.y > 0) return {...prev,y:prev.y-1};
            break;
          case 'DOWN': 
            if (prev.y < 29) return {...prev,y:prev.y+1};
            break;
          case 'LEFT': 
            if (prev.x > 0) return {...prev,x:prev.x-1};
            break;
          case 'RIGHT':
            if (prev.x < 29) return {...prev,x:prev.x+1};
            break;
        }
        return prev;
      });
    },70)
    return ()=> clearInterval(moveInterval)
  },[dir])
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {gameBoard.map((row,y)=>row.map((col,x)=>(
          <div className={styles.cell} key={`${x}-${y}`}/>
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

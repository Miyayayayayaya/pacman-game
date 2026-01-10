import { useEffect, useState } from 'react';
import styles from './App.module.css';

const makeGameBoard=(width:number,height:number):number[][]=>{
  const twoDimensionalArray:number[][]=Array.from({length:height},()=>Array.from({length:width},()=>0),);
  return twoDimensionalArray;
}

function App() {
  const [gameBoard, setGameBoard]=useState<number[][]>(makeGameBoard(30,30));
  const [pos,setPos]=useState({x:1,y:1});
  useEffect(()=>{
    const handleKeyDown=(e:KeyboardEvent)=>{
      console.log(e.key)
      setPos((prev)=>{
        switch(e.key){
          case 'ArrowUp': return {...prev, y:Math.max(1,prev.y-1)};
          case 'ArrowDown': return {...prev, y:Math.min(prev.y+1,30)};
          case 'ArrowLeft': return {...prev, x:Math.max(1,prev.x-1)};
          case 'ArrowRight': return {...prev, x:Math.min(prev.x+1,30)};
          default: return prev;
        }
      });
    };
    window.addEventListener('keydown',handleKeyDown);
    return()=>window.removeEventListener('keydown',handleKeyDown);
  },[])
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {gameBoard.map((row,y)=>row.map((col,x)=>(
          <div className={styles.cell} key={`${x}-${y}`}/>
        )))}
        <div className={styles.character}
        style={{left:(pos.x-1)*10,top:(pos.y-1)*10,zIndex:10}}>
          👤
        </div>
      </div>
    </div>
  )
}

export default App

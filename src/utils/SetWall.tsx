import { allStageMaps } from "./MapData";

type MakeGameWallProps={
    board:number[][],
    level:number;
}
export default function WallCoords({board,level}:MakeGameWallProps){
    const width=board.length;
    const height=board[0].length
    for (let kx=0; kx<width;kx++){
        board[0][kx]=1;
        board[height-1][kx]=1;
    }
    for(let ky=0;ky<height;ky++){
        board[ky][0]=1;
        board[ky][width-1]=1;
    }
    const wallCoords=allStageMaps[level]||[];
    wallCoords.forEach((coord)=>{
        if (coord.y<height&&coord.x<width){
            board[coord.y][coord.x]=1;
        }
    })
    board[1][1]=0;
}
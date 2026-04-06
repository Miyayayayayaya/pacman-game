type MakeGameItemProps={
    board:number[][];
}
export default function ItemCoords({board}:MakeGameItemProps){
    // const width=board.length;
    // const height=board[0].length;
    // for (let y=0;y<height;y++){
    //     for (let x=0;x<width;x++){
    //         if (board[y][x]===1) continue;
    //         const isCenter=(x>=6&&x<=8)&&(y>=7&&y<=8);
    //         if(!isCenter){
    //             board[y][x]=2;
    //         }else{
    //             board[y][x]=0;
    //         }
    //     }
    // }
    board[3][3]=2;
    board[1][1]=0;
}
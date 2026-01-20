type MakeGameItemProps={
    twoDimensionalArray:number[][];
}
export default function ItemCoords({twoDimensionalArray}:MakeGameItemProps){
    const width=twoDimensionalArray.length;
    const height=twoDimensionalArray[0].length;
    for (let y=0;y<height;y++){
        for (let x=0;x<width;x++){
            if (twoDimensionalArray[y][x]===1) continue;
            const isCenter=(x>=6&&x<=8)&&(y>=7&&y<=8);
            if(!isCenter){
                twoDimensionalArray[y][x]=2;
            }else{
                twoDimensionalArray[y][x]=0;
            }
        }
    }
    twoDimensionalArray[1][1]=0;
}
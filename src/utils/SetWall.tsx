type MakeGameWallProps={
    twoDimensionalArray:number[][]
}
export default function WallCoords({twoDimensionalArray}:MakeGameWallProps){
    const width=twoDimensionalArray.length;
    const height=twoDimensionalArray[0].length
    for (let kx=0; kx<width;kx++){
        twoDimensionalArray[0][kx]=1;
        twoDimensionalArray[height-1][kx]=1;
    }
    for(let ky=0;ky<height;ky++){
        twoDimensionalArray[ky][0]=1;
        twoDimensionalArray[ky][width-1]=1;
    }
    const wallCoords=[
        { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 }, { x: 9, y: 2 }, { x: 11, y: 2 }, { x: 12, y: 2 },
        { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 9, y: 3 }, { x: 11, y: 3 }, { x: 12, y: 3 },
        { x: 7, y: 4 }, { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 13, y: 5 },
        { x: 5, y: 8 }, { x: 9, y: 8 },
        { x: 1, y: 9 }, { x: 3, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 }, { x: 11, y: 9 }, { x: 13, y: 9 },
        { x: 3, y: 10 }, { x: 7, y: 10 }, { x: 11, y: 10 },
        { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 7, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 }, { x: 12, y: 11 },
        { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 11, y: 7 }, { x: 12, y: 7 },
    ];
    wallCoords.forEach((coord)=>{
        twoDimensionalArray[coord.y][coord.x]=1;
    })
    twoDimensionalArray[1][1]=0;
}
type CountItemProps={
    twoDimensionalArray:number[][];
}

export default function CountItem({twoDimensionalArray}:CountItemProps){
    const width=twoDimensionalArray.length
    const height=twoDimensionalArray[0].length
    let count=0
    for (let y=0;y<height;y++){
        for(let x=0;x<width;x++){
            if(twoDimensionalArray[y][x]===2){
                count+=1
            }
        }
    }
    return count
}
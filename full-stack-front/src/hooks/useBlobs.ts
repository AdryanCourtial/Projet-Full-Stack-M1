import { getRandomArbitrary } from "../utils/utils"


export interface Blob {
    x: string
    y: string
    size: string
}

const useBlobs = () => {

    const generateBlobs = (number: number): Blob[] => {
        let arrBlobs: Blob[] = []

        for (let time = 0; time < number; time++) {

            const x = `${getRandomArbitrary(10, 100)}%`
            const y = `${getRandomArbitrary(10, 100)}%`
            const size = `${getRandomArbitrary(100, 400)}px` 
            arrBlobs.push({
                x, y, size
            })
        }

        return arrBlobs
    }
    
    return {
        generateBlobs
    }
}

export default useBlobs
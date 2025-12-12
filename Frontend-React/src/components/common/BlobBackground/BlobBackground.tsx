import type React from 'react'
import './BlobBackground.css'
import { useEffect, useState } from 'react'
import useBlobs, { type Blob as BlobType } from '../../../hooks/useBlobs'
import Blob from '../../../assets/blob'

interface Props {
    children: React.ReactNode
    numBlobs?: number
}

const BlobBackground: React.FC<Props> = ({ children, numBlobs = 5 }) => {

    const [blobs, setBlobs] = useState<BlobType[]>([])

    const { generateBlobs } = useBlobs()

    useEffect(() => {
        const generateB = generateBlobs(numBlobs)
        setBlobs(generateB)
    }, [])


    
    return (
        <div className='base-layout'>
            
            <div className='child'>
                {children}
            </div>

            <div className='blob-background'>
                {
                    blobs.map((blob, index) => (
                        <Blob className='blob' key={index} style={{
                            left: blob.x,
                            top: blob.y,
                            width: blob.size
                        }}  />
                    ))
                }
            </div>

        </div>
    )
}

export default BlobBackground
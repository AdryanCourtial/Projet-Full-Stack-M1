import type React from 'react'
import './MainInteractiveContainer.css'

interface Props {
    children: React.ReactNode
    borderNeon?: boolean | undefined
}

const MainInteractiveContainer: React.FC<Props> = ({ children, borderNeon }) => {

    if (borderNeon){
        return (
            <div className='border-tag'>
                <div className='container-tag-neon'>
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div className='container-tag bg-glass-400'>
            {children}
        </div>
    )
}

export default MainInteractiveContainer
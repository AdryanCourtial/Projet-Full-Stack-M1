import type React from 'react'
import './MainInteractiveContainer.css'

interface Props {
    children: React.ReactNode
    style?: React.CSSProperties
    borderNeon?: boolean | undefined
}

const MainInteractiveContainer: React.FC<Props> = ({ children, borderNeon, style }) => {

    if (borderNeon){
        return (
            <div className='border-tag'>
                <div className='container-tag-neon' style={style}>
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div className='container-tag bg-glass-400' style={style}>
            {children}
        </div>
    )
}

export default MainInteractiveContainer
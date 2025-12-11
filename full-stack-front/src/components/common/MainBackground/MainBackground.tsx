import type React from "react";
import './MainBackground.css'

interface Props {
    children: React.ReactNode
}

const MainBackground: React.FC<Props> = ({ children }) => {

    

    return (
        <>
            <div className="container-background">
                <div className="layer-img" />
                <div className="layer-filter"/>
            </div>

            <div className="content">
                {children}
            </div>
        </>
    )
}

export default MainBackground
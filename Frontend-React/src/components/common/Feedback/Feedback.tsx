import './Feedback.css'
import type React from "react"

export interface Feeback {
    type: "success" | "error";
    text: string;
}

interface Props {
    feedBack?: Feeback
}

const Feedback: React.FC<Props> = ({ feedBack }) => {

    return (
        <>
        {
            feedBack && (
                <p 
                    className={`group-feedback ${feedBack.type}`}
                    role="status"
                    aria-live="polite"
                >
                    {feedBack?.text}
                </p>
            )
        }
        </>
    )
}

export default Feedback
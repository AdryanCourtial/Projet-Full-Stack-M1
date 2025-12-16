import type React from 'react'
import './TextInput.css'

interface Props {
    id: string,
    placeholder: string,
    label: string,
    className?: string
}

const TextInput: React.FC<Props> = ({ id, placeholder, label, className }) => {

    
    return (
        <label htmlFor={id} className={`label-input ${className ?? id}`}>
            {label}
            <input type="text" placeholder={placeholder} id={id} />
        </label>
    )
}

export default TextInput
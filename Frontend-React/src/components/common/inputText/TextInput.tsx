import type React from 'react'
import './TextInput.css'
import type { ChangeEvent } from 'react';

interface Props {
    id: string,
    placeholder: string,
    label: string,
    className?: string,
    regex?: RegExp,
    value: string | number,
    password?: boolean,
    type?: "number" | "text"
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const TextInput: React.FC<Props> = ({ id, placeholder, label, className, value, onChange, password, type }) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    }
    
    return (
        <label htmlFor={id} className={`label-input ${className ?? id}`}>
            {label}
            <input type={password ? "password" : type} placeholder={placeholder} id={id} value={value} onChange={handleChange} />
        </label>
    )
}

export default TextInput
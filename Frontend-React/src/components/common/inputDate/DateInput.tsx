import type React from 'react'
import './DateInput.css'
import type { ChangeEvent } from 'react';

interface Props {
    id: string,
    placeholder: string,
    label: string,
    className?: string,
    regex?: RegExp,
    value: string | number,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const DateInput: React.FC<Props> = ({ id, placeholder, label, className, value, onChange}) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    }
    
    return (
        <label htmlFor={id} className={`label-input-date ${className ?? id}`}>
            {label}
            <input type='date' placeholder={placeholder} id={id} value={value} onChange={handleChange} />
        </label>
    )
}

export default DateInput
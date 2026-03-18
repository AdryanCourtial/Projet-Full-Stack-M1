import type React from 'react'
import './SelecteurInput.css'
import type { ChangeEvent } from 'react'

interface Props {
  children?: React.ReactNode
  onChange: (value: string) => void
  label: string
  id: string
  className?: string
  value?: string
  defaultValue?: string
}

const SelecteurInput: React.FC<Props> = ({
  children,
  onChange,
  label,
  className,
  id,
  value,
  defaultValue
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <label htmlFor={id} className={`label-input ${className ?? ''}`}>
      <span>{label}</span>
      <select
        id={id}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
      >
        {children}
      </select>
    </label>
  )
}

export default SelecteurInput
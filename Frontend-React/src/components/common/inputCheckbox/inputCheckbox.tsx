import type React from 'react'
import './inputCheckbox.css'
import { useEffect } from 'react'

interface Props {
  onChange: (value: boolean) => void
  label: string
  id: string
  className?: string
  value: boolean
}

const CheckboxInput: React.FC<Props> = ({
  onChange,
  label,
  className,
  id,
  value,
}) => {

  useEffect(() => {
    console.log(value)
  }, [value])

  return (
    <label htmlFor={id} className={`label-input-check ${className ?? ''}`}>
      <span>{label}</span>
      <input
        type='checkbox'
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

export default CheckboxInput
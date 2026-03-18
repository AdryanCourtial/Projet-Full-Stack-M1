import { useEffect } from 'react'
import Background from '../Background/Background'
import './Popup.css'

interface Props {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const Popup = ({
  children,
  isOpen,
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: Props) => {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEscape, onClose])

  if (!isOpen) return null

  return (
    <Background onClick={closeOnBackdrop ? onClose : () => {}}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </Background>
  )
}

export default Popup
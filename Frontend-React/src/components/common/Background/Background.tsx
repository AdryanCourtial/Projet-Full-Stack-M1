import './Background.css'

interface Props {
  children: React.ReactNode
  onClick: () => void
}

const Background = ({ children, onClick }: Props) => {
  return (
    <div className="background" onClick={onClick}>
      {children}
    </div>
  )
}

export default Background
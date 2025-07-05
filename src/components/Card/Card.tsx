import { FC, ReactNode } from "react"

type CardProps = {
  title: string;
  children: ReactNode
}

const Card: FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <div className="title">{title}</div>
      <div className="content">{children}</div>
      <div></div>
    </div>
  )
}

export default Card

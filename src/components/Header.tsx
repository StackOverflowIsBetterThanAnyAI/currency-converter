import { FC } from 'react'

type HeaderProps = {
    children: string
}

const Header: FC<HeaderProps> = ({ children }) => {
    return <h1>{children}</h1>
}

export default Header

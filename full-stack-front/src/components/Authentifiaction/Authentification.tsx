import type React from 'react'
import './Authentification.css'
import { useAtom } from 'jotai'
import { authentificationAtom } from '../../atom/authentification'
import { useEffect, useState } from 'react'
import PageNotFound from '../../pages/404/404'

interface Props {
    children: React.ReactNode
}

const Authentification: React.FC<Props> = ({ children }) => {

    const [authentification, _] = useAtom(authentificationAtom)

    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        if (authentification) {
            setIsAuth(true)
        }
    }, [authentification])

    return (
        <>
        {
            !isAuth ? <PageNotFound /> : children
        }
        </>
    )
}

export default Authentification

 
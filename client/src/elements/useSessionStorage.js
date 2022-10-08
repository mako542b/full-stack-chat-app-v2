import { useState, useEffect } from "react"

export const useSessionStorage = (roomName, id) => {
    const [currentMessage, setCurrentMessage] = useState(() => {
        const msg = sessionStorage.getItem(roomName)
        return msg ? msg : ''
    })

    useEffect(() => {
        let msg = sessionStorage.getItem(id+roomName)
        msg = msg ? msg : ''
        setCurrentMessage(msg)
      }, [roomName, id])    
    
      useEffect(() => {
        sessionStorage.setItem(id+roomName, currentMessage)
      }, [ currentMessage, roomName, id])   
    
      useEffect(() => {
        // return () => {
          sessionStorage.clear()
        // }
        // eslint-disable-next-line
      }, [id])

    return [currentMessage, setCurrentMessage]
}


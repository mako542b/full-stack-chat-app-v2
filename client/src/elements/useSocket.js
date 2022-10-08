import { useRef } from "react"
import io from 'socket.io-client'


export const useSocket = (url, opt) => {
    let socket  = useRef(io(url, opt))
    return socket
}

import { useEffect, useState, useRef, useCallback, useReducer } from 'react'
import {ChatWindow} from './elements/ChatWindow'
import { LoginForm } from './elements/LoginForm'
import { useSocket } from './elements/useSocket'
import { useSessionStorage } from './elements/useSessionStorage'
import { defaultMessages, defaultRooms, addMessage } from './elements/defaultVariables'
import immer from 'immer'


const reducer = (state, action) => {
  switch (action.type) {
    case 'newMessage':
      return addMessage(state, action.payload.message, action.payload.message.room.name)

    case 'catchUp':
      const newMessages = immer(state, draft => {
          draft[action.payload.room] = action.payload.oldMessages
      })
      return newMessages

    case 'delete':
      const filteredMessages = immer(state, draft => {
          draft[action.payload.room] = draft[action.payload.room].filter(msg => msg.id !== action.payload.messageId)
      })
      return filteredMessages

    case 'edit':
      const editedMessages = immer(state, draft => {
        draft[action.payload.message.room.name].map(msg => {
          if (msg.id === action.payload.message.id){
            msg.content = action.payload.editingMessage
            msg.isEdited = true
            return msg
          } else {
            return msg
          }
        })
      })
      return editedMessages

    default :
      return state
  }
}

function App() {
  

  const [login, setLogin] = useState('')
  const [messages, dispatch] = useReducer(reducer, defaultMessages)
  const [id, setId] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [rooms, setRooms] = useState(defaultRooms)
  const [joinedRooms, setJoinedRooms] = useState(['general'])
  const [currentRoom, setCurrentRoom] = useState({name:'general', channel:true})
  const [allUsers, setAllUsers] = useState([])
  const [error, setError] = useState(null)
  const [newestMessage, setNewestMessage] = useState()
  const [unreadRooms, setUnreadRooms] = useState([])
  const [goDownButton, setGoDownButton] = useState(false)
  const [currentMessage, setCurrentMessage] = useSessionStorage(currentRoom.name, id)
  const observer = useRef()
  const scrollCurrentRef = useRef()

  const scrollRef = useCallback(node => {
    if(observer.current) observer.current.disconnect()
    if(!node) {
      setGoDownButton(false)
      return
    }
    scrollCurrentRef.current = node
    if(currentRoom.name === newestMessage?.room.name){
      node.scrollIntoView()
    }
    observer.current = new IntersectionObserver(entries => {
      setGoDownButton(!entries[0].isIntersecting)
    })
    observer.current.observe(node)
  },[currentRoom, newestMessage])

  let { current : socket } = useSocket('http://localhost:5000',{
    autoConnect: false,
  })


  
  useEffect(() => {
    socket.connect()
    startListeners()

    return () => {
      if(socket) {
        socket.removeAllListeners(['newMessage', 'updateUsers', 'connect'])
        socket.close()
      }
  }
    // eslint-disable-next-line
  },[socket])

  useEffect(() => {
    scrollCurrentRef?.current?.scrollIntoView()
    // eslint-disable-next-line
  },[currentRoom,scrollCurrentRef.current])


  useEffect(() => {
    if(newestMessage?.room?.name !== currentRoom.name) {
      setUnreadRooms(prev => [...new Set([...prev,newestMessage?.room?.name])])
      return
    }
    // eslint-disable-next-line
  },[newestMessage])

  const startListeners = () => {

    socket.on('newMessage', message => {
      if(!message.room.channel) {
        message.room.name = message.sender
      }
        dispatch({type: 'newMessage', payload: {message} })
        setNewestMessage(message)
    })

    socket.on('connect', () => {
      socket.emit('joinRoom', currentRoom, catchUp)
      setId(socket.id)
    })

    socket.on('updateUsers', (usersList) => {
      setAllUsers(usersList)
    })
  }
  
  const loginClick = () => {
    if(login !== '' && allUsers.every(user => user.name !== login)){
      setLoggedIn(true)
      socket.emit('newUser', login)
    } else {
      setError('error, login unavailable')
      return
    }
  }

  const joinRoomClick = () => {
    setJoinedRooms(prev => [...prev, currentRoom.name])
    socket.emit('joinRoom', currentRoom, catchUp)
  }

  const catchUp = (oldMessages, room) => {
    dispatch({type:'catchUp', payload: {oldMessages,room}})
    return
  }

  const sendMessage = (e) => {
    e.preventDefault()
    let message = {
      room: currentRoom,
      content: currentMessage,
      id: new Date(),
      sender: login,
      senderId: id,
      isEdited: false
    }
    socket.emit('message', message)

    if(!currentRoom.channel && currentRoom.name !== login) {
      dispatch({type: 'newMessage', payload: {message} })
    }
    setCurrentMessage('')
  }

  
  

  if(error) {
    return(
      <div style={{position:'fixed', top:'50%', left:'50%'}}>
        <div>{error}</div>
        <a href='/'>try again</a>
      </div>
    )
  }

  return (
    <div className='master-container'>
      <div className='id'>Hello {login} (id: {id})</div>
      {!loggedIn ? (<LoginForm 
          setLoggedIn={setLoggedIn} 
          socket={socket} 
          loginClick={loginClick} 
          setLogin={setLogin} 
          login={login}
          />) :
      (<ChatWindow 
          socket={socket} 
          setCurrentMessage={setCurrentMessage} 
          currentMessage={currentMessage} 
          rooms={rooms}
          setCurrentRoom={setCurrentRoom}
          joinRoomClick={joinRoomClick}
          messages={messages}
          currentRoom={currentRoom}
          sendMessage={sendMessage}
          id={id}
          setRooms={setRooms}
          allUsers={allUsers}
          login={login}
          joinedRooms={joinedRooms}
          scrollRef={scrollRef}
          unreadRooms={unreadRooms}
          setUnreadRooms={setUnreadRooms}
          goDownButton={goDownButton}
          scrollCurrentRef={scrollCurrentRef.current}
          dispatch={dispatch}
          />)}
    </div>
  )
}

export default App;

import Message from './Message'
import RoomButton from './RoomButton'
import { useState } from 'react'

export const ChatWindow = ({
    rooms,
    setCurrentRoom,
    allUsers,
    currentRoom,
    messages,
    currentMessage,
    sendMessage,
    joinRoomClick,
    setCurrentMessage,
    id,
    login,
    joinedRooms,
    scrollRef,
    unreadRooms,
    setUnreadRooms,
    goDownButton,
    scrollCurrentRef,
    dispatch
}) => {

    const [enterToSubmit, setEnterToSubmit] = useState(false)
    const [fill, setFill] = useState('red')


    const goDown = () => {
        // console.log(scrollRef)
        scrollCurrentRef.scrollIntoView()
    }
    const toggleSendEnter = (e) => {
        e.preventDefault()
        setEnterToSubmit(prev => !prev)
        const textArea = document.querySelector('textarea')
        textArea.focus()
        setFill(prev => prev === 'green'? 'red' : 'green')
        
    }

    const styleLabel = {position:'sticky', top:0, padding:'.5rem', background:'white'}
    const isJoined = () => joinedRooms.includes(currentRoom.name)
    const handleKeyDown = (e) => {
        // e.preventDefault()
        if(e.code === 'Enter' && enterToSubmit){
            e.preventDefault()
            let submitButton = document.querySelector('.submitButton')
            submitButton.click()
        }
        return
    }
    return (
        <div className="chat-container">
            <div className="rooms">
                <div className='public-rooms'>
                    <h3 style={styleLabel}>Rooms:</h3>
                    {rooms.map(room => <RoomButton key={room.name} setCurrentRoom={setCurrentRoom} room={room} currentRoom={currentRoom} unreadRooms={unreadRooms} setUnreadRooms={setUnreadRooms} setCurrentMessage={setCurrentMessage}/>)}
                </div>
                <div className='private-rooms'>
                    <h3 style={styleLabel}>Users:</h3>
                    {allUsers?.length > 0 && allUsers.map(user => <RoomButton key={user.id} setCurrentRoom={setCurrentRoom} room={user} currentRoom={currentRoom} login={login} unreadRooms={unreadRooms} setUnreadRooms={setUnreadRooms} setCurrentMessage={setCurrentMessage}/>)}
                </div>
            </div>
                {isJoined() || !currentRoom.channel ? (
                <div className="chat-and-textarea">
                    <div className="chat">
                        <>
                        {messages[currentRoom.name]?.length > 0 && (
                            messages[currentRoom.name].map((message, i) => {
                                if(messages[currentRoom.name].length === i+1){
                                    return <Message key={message.id} message={message} id={id} scrollRef={scrollRef} dispatch={dispatch}/>
                                } else {
                                    return <Message key={message.id} message={message} id={id} dispatch={dispatch}/>
                                }
                            })
                        )}
                        {goDownButton && <button onClick={goDown} style={{position:'fixed', top:'50%', left:'50%'}}>Go down</button>}
                        </>
                    </div>
                    <form onSubmit={sendMessage} style={{display:'flex'}}>
                        <textarea 
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={handleKeyDown} 
                            value={currentMessage}
                            required></textarea>
                        <div>
                            <button className='submitButton'>send</button>
                            <button onClick={toggleSendEnter}>
                            <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M20 5H8V9H6V3H22V21H6V15H8V19H20V5Z" fill={fill} />
  <path
    d="M13.0743 16.9498L11.6601 15.5356L14.1957 13H2V11H14.1956L11.6601 8.46451L13.0743 7.05029L18.024 12L13.0743 16.9498Z"
    fill="currentColor"
  />
        <title>Enter to send</title>
                            
                            </svg>
                            </button>
                        </div>
                    </form>
                </div>
                ) : (
                    <button onClick={joinRoomClick} className='join-button'>Join room</button>
                )}
        </div>
    )
}

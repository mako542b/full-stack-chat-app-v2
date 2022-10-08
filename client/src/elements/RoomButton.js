const RoomButton = ({
    setCurrentRoom,
    currentRoom,
    room,
    login,
    unreadRooms,
    setUnreadRooms
}) => {

    const isUnreed = () => {
        return unreadRooms.includes(room.name)
    }

    const toggleRoom = () => {
        setCurrentRoom(room)
        setUnreadRooms(prev => prev.filter(r => r !== room.name))
        // setCurrentMessage('')
    }

    return (
        
        <button 
            className='room-button'
            onClick={toggleRoom}>
            {currentRoom.name===room.name && <img src='./check.svg' alt='' className='check-img'></img>}
            {room.name}
            {login === room.name && <span style={{fontSize:'8px'}}> (you)</span>}
            {isUnreed() && <span style={{fontSize:'10px',color:'red'}}> new</span>}
        </button>
    )
}

export default RoomButton
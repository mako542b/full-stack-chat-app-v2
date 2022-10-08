import { useState } from "react"


const Message = ({message, id, scrollRef, dispatch}) => {

    const [isEditing, setIsEditing] = useState(false)
    const [editingMessage, setEditingMessage] = useState(message.content)

    let messageClass = message.senderId === id ? "message-self" : "message-other"
    let canDelete = message.senderId === id

    const deleteMessage = (room, messageId) => {
        if(window.confirm("Delete the item?")){
          dispatch({type: 'delete', payload: {room, messageId}})
          return
        }
      }

    const editMessage = () => {
        setIsEditing(true)
    }

    const udpadeComment = () => {
        dispatch({type:'edit', payload:{message,editingMessage}})
        setIsEditing(false)
    }

    const cancelEditing = () => {
        setEditingMessage(message.content)
        setIsEditing(false)
    }

    return(
        <div className={messageClass} ref={scrollRef ? scrollRef : null}>
            {!isEditing && (
            <>  
                {message.isEdited && <p style={{color:'blue',fontSize:'.5rem'}}>edited</p>}
                <p style={{borderBottom:'1px solid grey', paddingBottom:'.4rem'}}>{message.content}</p>
                <span className="sender">{message.sender}</span>
                {canDelete && <span className="sender" style={{left:0, padding:'.05rem .2rem', width:'fit-content', cursor:'pointer', border:'2px solid red', background:'blue'}} onClick={() => deleteMessage(message.room.name, message.id)}>x</span>}
                {canDelete && <span className="sender" style={{left:'1.5rem', width:'fit-content', cursor:'pointer', background:'blue'}} onClick={editMessage}>ed</span>}
            </>)}
            {isEditing && (<>
                <textarea value={editingMessage} onChange={(e) => setEditingMessage(e.target.value)}></textarea>
                <button onClick={cancelEditing}>cancel</button>
                <button onClick={udpadeComment} style={{marginLeft:'1rem'}}>edit</button>
            </>)}
        </div>
    )
}
export default Message
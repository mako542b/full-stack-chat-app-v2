import immer from 'immer'


export const defaultMessages = {
    general: [],
    jokes: [],
    trips: []
  }

  export const defaultRooms = [
    {
      name: 'general',
      channel: true
    },
    {
      name: 'jokes',
      channel: true
    },
    {
      name: 'trips',
      channel: true
    }
  ]

  export const addMessage = (oldMessages, newMessage, room) => {
    const newMessages = immer(oldMessages, draft => {
      if(draft[room]) {
        draft[room].push(newMessage)
      } else {
        draft[room] = [newMessage]
      }
    })
    return newMessages
  }
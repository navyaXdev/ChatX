import React, { createContext, useState } from 'react'

export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [name,setName] = useState("")
    const [conversationId,setConversationId] = useState("")
    const [key,setKey] = useState(null)
  return (
   <ChatContext.Provider value={{
    name,
    setName,
    conversationId,
    setConversationId,
    key,
    setKey
   }} >
    {children}
   </ChatContext.Provider>
  )
}

export default ChatProvider
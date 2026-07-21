import React, { createContext, useEffect, useState } from 'react'
import { deriveKey } from '../utils/cyptoUtils';
export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [name,setName] = useState("")
    const [conversationId,setConversationId] = useState("")
    const [key,setKey] = useState(null)
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {

        async function restoreSession() {

            const storedName = sessionStorage.getItem("name");
            const storedConversationId = sessionStorage.getItem("conversationId");
            const storedPassphrase = sessionStorage.getItem("passphrase");

            if(!storedName || !storedConversationId || !storedPassphrase) return;
            const DerivedKey = await deriveKey(storedPassphrase, storedConversationId);
            setConversationId(storedConversationId);
            setKey(DerivedKey);
            setName(storedName);
            setIsLoading(false);
        }

        restoreSession();

    }, [])
  return (
   <ChatContext.Provider value={{
    name,
    setName,
    conversationId,
    setConversationId,
    key,
    setKey,
    isLoading
   }} >
    {children}
   </ChatContext.Provider>
  )
}

export default ChatProvider
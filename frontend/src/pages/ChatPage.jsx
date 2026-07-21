import React, { useContext, useEffect, useState,useRef } from 'react';
import { ArrowLeft, Lock, Send } from 'lucide-react';
import { ChatContext } from '../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import formatTime from '../utils/timeFormatter';
import { deriveKey, encryptMessage } from '../utils/cyptoUtils';

const ChatPage = () => {
    const { name, key, conversationId, setName, setKey, setConversationId, isLoading } = useContext(ChatContext);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [messages, setMessages] = useState([

    ]);
    // console.log("the username is: ", name)
    // console.log("the key is:",key);
    // console.log("the conversationId is:",conversationId)





    const handleGoBack = () => {
        navigate("/")
    }

    async function handleSendMessage() {
        try {
            console.log("the form data is: ", message)
            const latestTime = new Date();
            const formatedTime = formatTime(latestTime);
            const newData = {
                id: crypto.randomUUID(),
                sender: name,
                time: formatedTime,
                text: message,
                isMe: true
            }
            const { ciphertext, iv } = await encryptMessage(message, key);
            const payload = {
                conversationId,
                senderName: name,
                ciphertext,
                iv
            }

            const res = await fetch("https://chatx-pfs9.onrender.com/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                // setMessages((state) => [...state, newData]);
                setMessage("");
            }
            console.log("the payload is:", payload)
            console.log("the data is: ", newData)
        } catch (error) {
            console.error("couldn't send message: ", error)
        }
    }

    const lastMessageId = useRef(0);
    useEffect(() => {
        const poll = async () => {
            try {
                const response = await fetch(`https://chatx-pfs9.onrender.com/messages?conversationId=${conversationId}&since=${lastMessageId.current}`);
                console.log("the response is: ", response)
                if (!response.ok) return;
                const msgs = await response.json();
                console.log("the messages are: ",msgs)

                for (const msg of msgs) {
                    lastMessageId.current = Math.max(
                        lastMessageId.current,
                        msg.messageId
                    );

                    let text;
                    try {
                        const plaintextBuffer = await crypto.subtle.decrypt(
                            { name: "AES-GCM", iv: base64ToArrayBuffer(msg.iv) },
                            key,
                            base64ToArrayBuffer(msg.ciphertext)
                        );
                        text = new TextDecoder().decode(plaintextBuffer);

                    } catch (error) {
                        text = "[Unable to decrypt — wrong passphrase or tampered message]";

                    }

                    setMessages((state) => [...state, {
                        id: msg.messageId,
                        sender: msg.senderName,
                        time: formatTime(new Date(msg.timestamp * 1000)),
                        text,
                        isMe: msg.senderName===name
                    }]);
                }



            } catch (error) {
                console.error("some error occured!", error)
            }
        }
        poll();
        const interval = setInterval(poll, 2500);
        return () => clearInterval(interval);

    }, [conversationId, key, name])

    function base64ToArrayBuffer(base64) {
        return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
    }

    return (
        <div className="flex flex-col h-screen bg-[#0b0e14] text-gray-300 font-sans">
            <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50 bg-[#0f1117]">
                <div className="flex items-center gap-4">
                    <button onClick={handleGoBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors ">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Lock size={16} className="text-blue-400" />
                        <h1 className="text-white font-bold text-lg">Secure Chat</h1>
                        <span className="text-xs text-gray-500 ml-2 font-mono">{conversationId}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-green-500">Polling</span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-3xl flex flex-col ${msg.isMe ? 'ml-24' : 'mr-24'}`}
                    >
                        <div
                            className={`rounded-xl p-4 border transition-all ${msg.isMe
                                ? 'bg-[#1e2d5a] border-blue-500/30 shadow-lg shadow-blue-900/10'
                                : 'bg-[#161922] border-gray-800'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold ${msg.isMe ? 'text-blue-300' : 'text-gray-400'}`}>
                                    {msg.sender}
                                </span>
                                <span className="text-[10px] text-gray-600 font-mono">[{msg.time}]</span>
                            </div>
                            <p className="text-white leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </main>

            <footer className="p-4 bg-[#0f1117] border-t border-gray-800/50">
                <div
                    className="max-w-5xl mx-auto flex gap-3"
                >
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 bg-[#161922] border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                    />
                    <button
                        onClick={handleSendMessage}
                        type="submit"
                        className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <Send size={18} />
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;
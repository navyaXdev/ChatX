import React, { useContext, useState } from 'react';
import { ArrowLeft, Lock, Send } from 'lucide-react';
import { ChatContext } from '../context/ChatProvider';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const { name,key,conversationId } = useContext(ChatContext);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    console.log("the username is: ", name)
    console.log("the key is:",key);
    console.log("the conversationId is:",conversationId)


    const messages = [
        {
            id: 1,
            sender: 'Dinesh',
            time: '10:01',
            text: 'Hey, ready to test the relay?',
            isMe: false,
        },
        {
            id: 2,
            sender: 'Me',
            time: '10:02',
            text: 'Yes, encrypted blobs are flying 🚀',
            isMe: true,
        },
        {
            id: 3,
            sender: 'Dinesh',
            time: '10:03',
            text: "Check the DB — it's all gibberish!",
            isMe: false,
        },
    ];

    const handleGoBack = ()=>{
        navigate("/")
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
                        <span className="text-xs text-gray-500 ml-2 font-mono">room1</span>
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
                <form
                    className="max-w-5xl mx-auto flex gap-3"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 bg-[#161922] border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                    />
                    <button
                        type="submit"
                        className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <Send size={18} />
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatPage;
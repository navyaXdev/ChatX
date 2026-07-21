import React, { useContext, useState } from 'react';
import { Key, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deriveKey } from '../utils/cyptoUtils';
import { ChatContext } from '../context/ChatProvider';

const EnterUser = () => {
  const [formData, setFormData] = useState({
    conversationId: 'room1',
    name: 'Mohit',
    passphrase: ''
  });
  const navigate = useNavigate();
  const {setName, setKey, setConversationId} = useContext(ChatContext);


  async function handleSubmit(e){
    e.preventDefault();
    if(!formData.conversationId.trim() || !formData.name.trim() || !formData.passphrase.trim()) return;
    const key = await deriveKey(formData.passphrase,formData.conversationId);
    setName(formData.name);
    setKey(key);
    setConversationId(formData.conversationId);

    sessionStorage.setItem("name",formData.name);
    sessionStorage.setItem("conversationId",formData.conversationId);
    sessionStorage.setItem("passphrase",formData.passphrase);

    navigate("/chat");
  }

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-110 bg-[#1a1c23] rounded-4xl p-10 shadow-2xl border border-white/5">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl border-2 border-transparent bg-linear-to-br from-cyan-400 via-blue-500 to-purple-600 p-1">
               <div className="w-full h-full bg-[#1a1c23] rounded-[10px] flex items-center justify-center relative">
                 <MessageSquare className="text-cyan-400 w-6 h-6" />
                 <X className="absolute -top-1 -right-1 w-4 h-4 text-purple-400 font-bold" />
               </div>
            </div>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">ChatX</span>
        </div>

        <div className="mb-10">
          <h1 className="text-white text-4xl font-bold mb-3">Secure Chat</h1>
          <p className="text-gray-400 text-lg">Join a private conversation with your room details.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-300 font-semibold text-sm">Conversation ID</label>
            <input
              type="text"
              value={formData.conversationId}
              onChange={(e) => setFormData({...formData, conversationId: e.target.value})}
              className="w-full bg-[#242731] border border-gray-700/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-semibold text-sm">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#242731] border border-gray-700/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-semibold text-sm">Shared Passphrase</label>
            <input
              type="password"
              placeholder="Enter passphrase"
              value={formData.passphrase}
              onChange={(e) => setFormData({...formData, passphrase: e.target.value})}
              className="w-full bg-[#242731] border border-gray-700/50 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <button onClick={handleSubmit} className="w-full mt-4 bg-linear-to-r from-[#1d8cff] to-[#804dff] hover:opacity-90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
            <Key size={20} className="-rotate-45" />
            Join Chat
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Your room details stay private to this session.
        </p>
      </div>
    </div>
  );
};

export default EnterUser;
import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {key} = useContext(ChatContext);
    if(!key) return <Navigate to={"/"} replace />
    else return children
}

export default ProtectedRoute
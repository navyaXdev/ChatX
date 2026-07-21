import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import EnterUser from './pages/EnterUser'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './route/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<EnterUser />} />

        <Route path='/chat' element={

          <ProtectedRoute>

            <ChatPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

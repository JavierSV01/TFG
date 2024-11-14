import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { UserRoleProvider } from './context/useUserRole'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <UserRoleProvider>
    <App />
  </UserRoleProvider>
)

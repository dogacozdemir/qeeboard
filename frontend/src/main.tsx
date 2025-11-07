import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProfilePage from './pages/Profile'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import CartPage from './pages/Cart'
import DesignerEmbed from './pages/DesignerEmbed'
import OrderDetailPage from './pages/OrderDetail'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/designer', element: <DesignerEmbed /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
  { path: '/cart', element: <ProtectedRoute><CartPage /></ProtectedRoute> },
  { path: '/orders/:id', element: <ProtectedRoute><OrderDetailPage /></ProtectedRoute> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

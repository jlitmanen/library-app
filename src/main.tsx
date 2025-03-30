import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Layout from './layout/layout.tsx'
import { AuthProvider } from './auth/authcontext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Layout>
        <App />
      </Layout>
    </AuthProvider>
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
// change Browser -> Hash
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Gallery from './pages/Gallery.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import RouterErrorPage from './components/RouterErrorPage.jsx'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouterErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'about', element: <AboutPage /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
)

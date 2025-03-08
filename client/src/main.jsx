import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { CartProvider } from './provider/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CartProvider>
      <RouterProvider router={router}>
          <App />
      </RouterProvider>
    </CartProvider>
  </Provider>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'



async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
 
  const { worker } = await import('./mocks/browser')
 
  // worker.start() returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement)
 
/*enableMocking().then(() => {
  root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>)
})*/

root.render(<App />)
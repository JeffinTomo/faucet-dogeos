import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DogeFaucet from './dogeos.tsx'

import "./faucet.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DogeFaucet />
  </StrictMode>,
)

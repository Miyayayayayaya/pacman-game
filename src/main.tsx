import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route,Routes} from 'react-router-dom';
import RankingBoard from './hooks/RankingBoard.tsx';
import './index.css';
const rootElement=document.getElementById('root');
if (rootElement){
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/ranking' element={<RankingBoard/>}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  )
}
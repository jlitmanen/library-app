import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Search from './views/search';
import Home from './views/home';
import Login from './views/login';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/search'} element={<Search />} />
          <Route path={'/login'} element={<Login />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
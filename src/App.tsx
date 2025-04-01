import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Search from './views/search';
import Home from './views/home';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/search'} element={<Search />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
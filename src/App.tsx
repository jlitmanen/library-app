import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Search from './views/search';
import Home from './views/home';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path={'/search'} element={<Search />} />
          <Route path={'/'} element={<Home />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
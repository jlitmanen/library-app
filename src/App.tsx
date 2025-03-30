import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Search from './views/search';
import Home from './views/home';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Etusivu</Link>
            </li>
            <li>
              <Link to="/search">Hakue</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path={'/search'} element={<Search />} />
          <Route path={'/'} element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
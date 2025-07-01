import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Challenge from './pages/Challenge';

function App() {
  return (
    <>
      <h1 className="text-3xl text-red-500 font-bold">Tailwind works!</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenge/:id" element={<Challenge />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
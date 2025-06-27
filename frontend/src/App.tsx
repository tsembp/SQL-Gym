import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Challenge from './pages/Challenge';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge/:id" element={<Challenge />} />
      </Routes>
    </Router>
  );
}

export default App;
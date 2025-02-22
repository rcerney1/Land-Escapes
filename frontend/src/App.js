import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";

function NotFound() {
  return <div className="p-10 text-3xl font-bold">404 - Page Not Found</div>
}
function App() {
  return (
    <Router>
      {window.location.pathname !== "/admin" && <Navbar />}  {/* Hide navbar on Admin */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

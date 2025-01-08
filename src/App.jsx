// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import Nosotras from "./pages/Nosotras";
import Contacto from "./pages/Contacto";
import AlquilerVenta from "./pages/AlquilerVenta";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotras" element={<Nosotras />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/alquiler-venta" element={<AlquilerVenta />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

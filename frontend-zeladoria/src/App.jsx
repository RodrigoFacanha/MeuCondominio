import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Cadastro from "./pages/cadastro/Cadastro.jsx";
import RecuperarSenha from "./pages/recuperarSenha/RecuperarSenha.jsx";
import MoradorHome from "./pages/morador/MoradorHome.jsx";
import SindicoHome from "./pages/sindico/SindicoHome.jsx";

function RotaProtegida({ children, perfilExigido }) {
   const token = localStorage.getItem('token');
   const perfil = localStorage.getItem('perfil');

   if (!token) return <Navigate to="/" replace />;
   if (perfilExigido && perfil !== perfilExigido) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} /> 

        <Route
          path="/morador"
          element={
            <RotaProtegida perfilExigido="morador">
              <MoradorHome />
            </RotaProtegida>
          }
        />

       <Route path="/sindico" element={
  <RotaProtegida>
    <SindicoHome />
  </RotaProtegida>
} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

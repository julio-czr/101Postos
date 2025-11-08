import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "@/view/pages/login/Login";
import Home from "@/view/pages/home/Home";
import PrivateRoute from '@/context/auth/PrivateRoute';
import PerfilConfig from '@/view/pages/perfilConfig/perfilConfig';
import EstablishmentsConfig from './view/pages/establishmentsConfig/EstablishmentsConfig';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route 
          path="/" 
          element={<LoginForm />} 
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/perfil"
          element={
            <PrivateRoute>
              <PerfilConfig />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/estabelecimento"
          element={
            <PrivateRoute>
              <EstablishmentsConfig />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;

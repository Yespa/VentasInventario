import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import PuntoVenta from "./scenes/puntoVenta";
import Facturas from "./scenes/facturas";
import Inventario from "./scenes/inventario";
import Gastos from "./scenes/gastos";
import Apartados from "./scenes/apartado";
import Cierre from "./scenes/cierre";
import Form from "./scenes/form";
import Estadisticas from "./scenes/estadisticas";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/puntoventa" element={<PuntoVenta />} />
              <Route path="/facturas" element={<Facturas />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/gastos" element={<Gastos />} />
              <Route path="/apartados" element={<Apartados />} />
              <Route path="/cierre" element={<Cierre />} />
              <Route path="/form" element={<Form />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

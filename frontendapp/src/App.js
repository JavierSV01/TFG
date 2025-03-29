import { PaginaLogin } from './paginas/PaginaLogin'
import { PaginaPrincipal } from './paginas/PaginaPrincipal'
import { PaginaCreacionEntrenamiento } from './paginas/PaginaCreacionEntrenamiento'
import { PaginaMiPerfil } from './paginas/PaginaMiPerfil'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { PaginaMiCliente } from './paginas/PaginaMiCliente'
import { PaginaMiEntrenador } from './paginas/PaginaMiEntrenador'
import { PaginaMiEntrenamiento } from './paginas/PaginaMiEntrenamiento'
import { PaginaDiaEntrenamiento } from './paginas/PaginaDiaEntrenamieto'
import PaginaUnChat from './paginas/PaginaUnChat'
import { PaginaEntrenamietoCliente } from './paginas/PaginaEntrenamientoCliente'
import { PaginaCrearDieta } from './paginas/PaginaCrearDieta'
import { LayoutConNavbar } from './componentes/LayoutConNavbar'
import { PaginaMiDieta } from './paginas/PaginaMiDieta'
import { PaginaDietaCliente } from './paginas/PaginaDietaCliente'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PaginaLogin />} />
        <Route element={<LayoutConNavbar />}> {/* Usa LayoutConNavbar como padre */}
          <Route path='/principal' element={<PaginaPrincipal />} />
          <Route path='/perfil' element={<PaginaMiPerfil />} />
          <Route path='/crearEntrenamiento' element={<PaginaCreacionEntrenamiento />} />
          <Route path='/crearDieta' element={<PaginaCrearDieta />} />

          <Route path='/cliente/:usuario' element={<PaginaMiCliente />} />
          <Route path='/cliente/:usuario/:idEntrenamiento' element={<PaginaEntrenamietoCliente />} />
          <Route path='/cliente/:usuario/dieta' element={<PaginaDietaCliente />} />

          <Route path='/entrenador/:entrenador' element={<PaginaMiEntrenador />} />
          <Route path='/entrenador/:entrenador/:idEntrenamiento' element={<PaginaMiEntrenamiento />} />
          <Route path='/entrenador/:entrenador/:idEntrenamiento/:semIndex/:dayIndex' element={<PaginaDiaEntrenamiento />} />
          <Route path='/entrenador/:entrenador/dieta' element={<PaginaMiDieta />} />

          <Route path='/chat/:idChat' element={<PaginaUnChat />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

import './App.css'
import {BrowserRouter, Routes, Route} from "react-router";
import AdminPage from "@/screens/admin-screen/Admin-page.tsx";
import UserPage from "@/screens/user-screen/User.page.tsx";
import {
    GlobalAuthenticationWrapper
} from "@/components/authentication-wrapper/GlobalAuthenticationWrapper.component.tsx";
import {RoleGuard} from "@/components/role-guard/RoleGuard.component.tsx";

function App() {

  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<GlobalAuthenticationWrapper><></></GlobalAuthenticationWrapper>}/>
            <Route path="/admin" element={<GlobalAuthenticationWrapper><RoleGuard role="ADMIN" redirectTo={"/forbidden"}><AdminPage/></RoleGuard></GlobalAuthenticationWrapper>}/>
            <Route path="/user" element={<GlobalAuthenticationWrapper><RoleGuard role="USER" redirectTo={"/forbidden"}><UserPage/></RoleGuard></GlobalAuthenticationWrapper>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App

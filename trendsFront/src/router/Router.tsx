import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import TrendProfile from "../pages/TrendProfile";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Places from "../pages/Places";
import ProfileEdit from "../pages/ProfileEdit";
import CreatePost from "../pages/CreatePost";
import EditPost from "../pages/EditPost";
import EditTrendProfile from "../pages/EditTrendProfile";
import Posts from "../pages/Posts";
import Login from "../pages/Login";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/lugares" element={<Places />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/editar-perfil" element={<ProfileEdit />} />
        <Route path="/crear-publicacion" element={<CreatePost />} />
        <Route path="/editar-publicacion" element={<EditPost />} />
        <Route path="/tendencia-perfil" element={<TrendProfile />} />
        <Route path="/editar-perfil-tendencia" element={<EditTrendProfile />} />
        <Route path="/publicaciones" element={<Posts />} />
        <Route path="/busquedas" element={<Posts />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
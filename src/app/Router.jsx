import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "pages/Home";
import Article from "pages/Article";
import AboutPage from "pages/About";
import LoginPage from "pages/Login";
import AdminPage from "pages/admin";
import HoroscopePage from "pages/horoscope/HoroscopePage";
import ProtectedRoute from "features/auth/ui/protected-route";

import Header from "widgets/Header";
import Footer from "widgets/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Все публичные страницы с общим лейаутом */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/articles/:slug" element={<Article />} />
        <Route path="/horoscope" element={<HoroscopePage />} />
        <Route path="/horoscope/:id" element={<HoroscopePage />} />
      </Route>

      {/* Страницы без лейаута */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

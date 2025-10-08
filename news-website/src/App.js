import Header from "widgets/Header";
import Footer from "widgets/Footer";
import Home from "pages/Home";
import Article from "pages/Article";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./shared/lib/ScrollToTop";
import AboutPage from "pages/About";

function App() {
    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/articles/:slug" element={<Article />} />
                </Routes>
                <Footer />
            </Router>
        </HelmetProvider>
    );
}

export default App;

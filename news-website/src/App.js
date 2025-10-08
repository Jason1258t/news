import Header from "features/header";
import { Footer } from "shared/ui";
import Home from "pages/Home";
import Article from "pages/Article";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./shared/lib/ScrollToTop";

function App() {
    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/articles/:slug" element={<Article />} />
                </Routes>
                <Footer />
            </Router>
        </HelmetProvider>
    );
}

export default App;

import Header from "widgets/Header";
import Footer from "widgets/Footer";
import HomePage from "pages/Home";
import ArticlePage from "pages/Article";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./shared/lib/ScrollToTop";
import AboutPage from "pages/About";
import { QueryProvider } from "app/query/QueryProvider";
import CreateArticlePage from "pages/CreateArticle";
import EditorsPickPanel from "pages/EditorsPickPanel";
import "app/theme.css";
import "app/layout.css";

const App = () => {
    return (
        <QueryProvider>
            <HelmetProvider>
                <Router>
                    <ScrollToTop />
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/articles/:slug" element={<ArticlePage />} />
                        <Route
                            path="/create-article"
                            element={<CreateArticlePage />}
                        />
                        <Route
                            path="editors-pick-panel"
                            element={<EditorsPickPanel />}
                        />
                    </Routes>
                    <Footer />
                </Router>
            </HelmetProvider>
        </QueryProvider>
    );
};

export default App;

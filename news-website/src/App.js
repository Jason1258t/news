import { Header, Footer } from "./shared/ui";
import Home from "./pages/Home";
import MessengerGossvat from "./pages/MessengerGossvat";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/articles/messenger-gossvat"
                    element={<MessengerGossvat />}
                />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;

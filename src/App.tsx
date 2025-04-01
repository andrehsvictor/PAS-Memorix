import { Route, Routes } from "react-router-dom";
import "./App.css";
import DecksPage from "./pages/decks/page";
import LoginPage from "./pages/login/page";
import NotFoundPage from "./pages/not-found/page";
import SignupPage from "./pages/signup/page";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route index element={<DecksPage />} />
        <Route path="decks" element={<DecksPage />} />
      </Route>
    </Routes>
  );
}

export default App;

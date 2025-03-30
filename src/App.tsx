import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login/page";
import NotFoundPage from "./pages/not-found/page";
import SignupPage from "./pages/signup/page";
import { AuthProvider } from "./contexts/auth-context";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/">
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route
              index
              element={
                <div className="text-3xl font-bold underline">Hello world!</div>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

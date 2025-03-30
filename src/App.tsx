import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <div className="text-3xl font-bold underline">Hello world!</div>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="about"
            element={<div className="text-3xl font-bold underline">About</div>}
          />
          <Route
            path="*"
            element={
              <div className="text-3xl font-bold underline">404 Not Found</div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

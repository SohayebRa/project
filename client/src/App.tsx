import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Confirm from "./pages/auth/Confirm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Create from "./pages/properties/Create";
import AddImage from "./pages/properties/AddImage";
import Properties from "./pages/properties/Properties";
import View from "./pages/properties/View";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/confirm/:token" element={<Confirm />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/auth/forgot-password/:token"
            element={<ResetPassword />}
          />
          {/* Properties */}
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<View />} />
          <Route path="/properties/create" element={<Create />} />
          <Route path="/properties/add-image/:id" element={<AddImage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

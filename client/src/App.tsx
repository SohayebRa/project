import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Confirm from "./pages/auth/Confirm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Create from "./pages/properties/Create";
import AddImage from "./pages/properties/AddImage";
import Properties from "./pages/properties/Properties";
import View from "./pages/properties/View";
import Messages from "./pages/properties/Messages";
import Edit from "./pages/properties/Edit";
import Layout from "./components/Layout";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/confirm/:token" element={<Confirm />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/auth/forgot-password/:token"
            element={<ResetPassword />}
          />
          <Route path="/" element={<Layout />}>
            <Route path="profile" element={<Profile />} />
            {/* App */}
            <Route path="/" element={<Home />} />
            <Route path="categories/:id" element={<Category />} />
            <Route path="404" element={<NotFound />} />

            {/* Administration */}
            <Route path="properties" element={<Properties />} />
            <Route path="property/:id" element={<View />} />
            <Route path="properties/create" element={<Create />} />
            <Route path="properties/edit/:id" element={<Edit />} />
            <Route path="properties/add-image/:id" element={<AddImage />} />
            <Route path="messages/:id" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

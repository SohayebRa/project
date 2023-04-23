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
            <Route path="/" element={<Home />} />
            <Route
              path="404"
              element={
                <div className="text-4xl font-semibold text-center text-indigo-900 my-36 flex flex-col items-center gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className=" w-24 h-24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  404 NOT FOUND
                </div>
              }
            />
            {/* Admin Properties */}
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

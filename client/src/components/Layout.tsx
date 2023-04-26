// Layout
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useApp from "../hooks/useApp";
import Logo from "./../assets/png/LogoBlack.png";
import Navbar from "./Navbar";

const Layout = () => {
  const { setCookie, session } = useApp();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState<number>(0);

  const logout = () => {
    setCookie({ name: "_token", value: "" });
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col justify-between">
      <header className="bg-indigo-50 p-4 shadow-lg flex flex-col gap-2 sm:flex-row justify-between items-center">
        {session ? (
          <div className="flex flex-col container mx-auto">
            <div className="w-full sm:container mx-auto flex flex-col sm:flex-row gap-2 justify-between items-center">
              <a href="/">
                <img
                  src={Logo}
                  className="px-2 w-8/12 md:w-4/12 lg:w-3/12 py-4 mx-auto sm:mx-0"
                />
              </a>
              <nav className="my-5 text-sm flex items-center gap-10 font-medium ">
                <a
                  href="/properties"
                  className="text-indigo-800 hover:text-indigo-600"
                >
                  Mes propriétés
                </a>
                <a
                  href="/profile"
                  className="text-indigo-800 hover:text-indigo-600"
                >
                  Mon profil
                </a>
                <button
                  onClick={logout}
                  className="bg-indigo-800 hover:bg-indigo-600 transition py-4 px-6 text-white font-medium flex gap-2 items-center rounded-sm"
                >
                  <i className="fa-solid fa-power-off"></i>
                  <span className="hidden sm:flex">Se déconnecter</span>
                </button>
              </nav>
            </div>
            <Navbar
              navigate={navigate}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
            />
          </div>
        ) : (
          <div className="flex flex-col container mx-auto">
            <div className="container mx-auto flex flex-col sm:flex-row gap-2 justify-between items-center">
              <a href="/">
                <img
                  src={Logo}
                  className="px-2 w-8/12 md:w-4/12 lg:w-3/12 py-4 mx-auto sm:mx-0"
                />
              </a>
              <nav className="my-5 text-sm flex items-center gap-10 font-medium">
                <a
                  href="/auth/signup"
                  className="text-indigo-800 hover:text-indigo-600 flex gap-3 items-center transition"
                >
                  <i className="fa-solid fa-address-book"></i> S'inscrire
                </a>
                <a
                  href="/auth/login"
                  className="text-indigo-800 hover:text-indigo-600 flex gap-3 items-center transition"
                >
                  <i className="fa-solid fa-user"></i> Se connecter
                </a>
              </nav>
            </div>
            <Navbar
              navigate={navigate}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
            />
          </div>
        )}
      </header>
      <main className="flex-1 relative">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="absolute z-50 bottom-6 right-5 hover:brightness-150 transition hover:bottom-7"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#3730a3"
            viewBox="0 0 22 22"
            strokeWidth={1.2}
            stroke="white"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <Outlet />
      </main>
      <footer className="bg-indigo-900 py-4">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row justify-between items-center">
          <div className="flex gap-3 items-center">
            <a
              href="https://www.instagram.com/sohayeb.ra/"
              className="text-gray-100 text-sm"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/sohayeb-rajjaf-1bb3621b1/"
              className="text-gray-100 text-sm"
            >
              LinkedIn
            </a>
          </div>
          <p className="text-sm text-white">
            Sohayeb RAJJAF © {new Date().getFullYear()} Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

// Layout
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useApp from "../hooks/useApp";
import Logo from "./../assets/png/LogoBlack.png";
import { categories } from "../helpers/arrays";

const Layout = () => {
  const { setCookie, session } = useApp();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState<number>(0);

  const logout = () => {
    setCookie({ name: "_token", value: "" });
    navigate("/auth/login");
  };

  return (
    <div className="h-screen flex flex-col justify-between">
      <header className="bg-indigo-50 p-4 shadow-lg flex flex-col gap-2 sm:flex-row justify-between items-center">
        {session ? (
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
              <a href="" className="text-indigo-800 hover:text-indigo-600">
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
            <div className="bg-indigo-50 py-5 lg:block border-t border-slate-300 mt-2">
              <div className="container mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
                <nav className="sm:flex sm:flex-wrap sm:gap-6 hidden">
                  <a
                    href="/categories/1"
                    className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
                  >
                    Maisons
                  </a>
                  <a
                    href="/categories/2"
                    className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
                  >
                    Appartements
                  </a>
                  <a
                    href="/categories/3"
                    className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
                  >
                    Entrepôts
                  </a>
                  <a
                    href="/categories/4"
                    className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
                  >
                    Bureaux
                  </a>
                  <a
                    href="/categories/5"
                    className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
                  >
                    Terrains
                  </a>
                  <a
                    href="/categories/6"
                    className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
                  >
                    Cabanes
                  </a>
                </nav>
                <select
                  className="text-md font-medium uppercase border text-indigo-800 hover:text-indigo-600 transition sm:hidden p-4 w-full rounded-sm shadow-md"
                  value={categoryId}
                  onChange={(e) => {
                    const category = categories.find(
                      (category) => category.id === e.target.value
                    );
                    if (category) {
                      navigate(`/categories/${category.name.toLowerCase()}`);
                    }
                  }}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <form className="flex items-center w-full sm:w-auto">
                  <input
                    type="text"
                    name="search"
                    placeholder="Chercher par ville ou code postal"
                    className="py-4 px-5 text-base shadow-md rounded-sm w-4/6"
                  />
                  <input
                    type="submit"
                    className="bg-indigo-800 hover:bg-indigo-600 transition text-white  font-medium py-4 px-5 cursor-pointer text-base rounded-sm w-2/6"
                    value="Chercher"
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
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
            By Sohayeb RAJJAF © 2023 Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

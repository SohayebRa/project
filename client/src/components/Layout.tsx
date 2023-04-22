// Layout
import { useNavigate } from "react-router-dom";
import useApp from "../hooks/useApp";
import Logo from "./../assets/png/LogoBlack.png";

const Layout = () => {
  const { setCookie, session } = useApp();
  const navigate = useNavigate();

  const logout = () => {
    setCookie({ name: "_token", value: "" });
    navigate("/auth/login");
  };

  return (
    <header className="bg-indigo-50 p-4 shadow-lg">
      {session ? (
        <div className="container mx-auto flex justify-between items-center">
          <a href="/">
            <img src={Logo} className="px-2 w-8/12 md:w-4/12 lg:w-3/12 py-4" />
          </a>
          <nav className="my-5 text-sm md:flex md:items-center md:gap-10 font-medium hidden">
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
              <i className="fa-solid fa-power-off"></i> Se déconnecter
            </button>
          </nav>
        </div>
      ) : (
        <>
          <div className="container mx-auto flex justify-between items-center">
            <a href="/">
              <img
                src={Logo}
                className="px-2 w-8/12 md:w-4/12 lg:w-3/12 py-4"
              />
            </a>
            <nav className="my-5 text-sm md:flex md:items-center md:gap-10 font-medium hidden">
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
            <div className="container mx-auto flex justify-between items-center">
              <nav className="flex gap-6">
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
              <form
                action="/search"
                method="POST"
                className="flex items-center"
              >
                <input
                  type="text"
                  name="recherche"
                  placeholder="Chercher des propriétés"
                  className="py-3 px-5 text-base shadow-md rounded-sm"
                />
                <input
                  type="submit"
                  className="bg-indigo-800 hover:bg-indigo-600 transition text-white  font-medium py-3 px-5 cursor-pointer text-base rounded-sm"
                  value="Chercher"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
export default Layout;

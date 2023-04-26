// Login page
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetPageTitle } from "./../../hooks/useSetPageTitle";
import useApp from "../../hooks/useApp";
import Logo from "./../../assets/png/LogoBlack.png";
import Cookies from "js-cookie";

interface UserData {
  page: string;
  errors?: { msg: string }[];
  user?: {
    name: string;
    email: string;
  };
  msg: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setCookie, session } = useApp();
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getData, setGetData] = useState<UserData>({
    page: "",
    errors: [],
    user: {
      name: "",
      email: "",
    },
    msg: "",
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(url + "/auth/login", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setGetData(data));
  }, []);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Envoyer les données au serveur
    const response = await fetch(url + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCookie({ name: data.cookieName, value: data.cookieValue });
        setGetData(data);
      })
      .catch((error) => console.error(error));

    const session = Cookies.get("_token");
    session && navigate("/");
  };

  return (
    <div className="py-32">
      <img src={Logo} className="mx-auto w-8/12 md:w-4/12 lg:w-2/12 py-4" />
      <h2 className="text-center text-2xl font-semibold text-indigo-900">
        {getData.page}
      </h2>
      {getData.errors ? (
        <div className="max-w-md mx-auto my-10">
          {getData.errors.map((error) => (
            <p
              key={error.msg}
              className="bg-red-100 text-red-600 border border-red-600 text-sm text-center p-2 mb-1"
            >
              {error.msg}
            </p>
          ))}
        </div>
      ) : (
        getData.msg && (
          <div className="max-w-md mx-auto my-10">
            <p className="bg-green-100 text-green-600 border border-green-600 text-sm text-center p-2 mb-1">
              {getData.msg}
            </p>
          </div>
        )
      )}
      <div className="mt-8 mx-auto max-w-md">
        <div className="bg-white py-8 px-4 shadow-md border border-[1] rounded-md">
          <form
            className="space-y-5"
            method="POST"
            action="/auth/login"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                className="block text-sm uppercase text-gray-500 mb-2 font-medium"
                htmlFor="email"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                placeholder="E-mail"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm uppercase text-gray-500 mb-2 font-medium"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <input
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                placeholder="Mot de passe"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <input
              className="w-full bg-indigo-900 hover:bg-indigo-700 transition text-white font-medium py-3 cursor-pointer"
              type="submit"
              value="Se connecter"
            />
            <div className="flex flex-col items-center">
              <a
                className="text-gray-500 hover:text-indigo-800 transition text-sm"
                href="/auth/signup"
              >
                Vous n'avez pas de compte ? Inscrivez-vous
              </a>
              <a
                className="text-gray-500 hover:text-indigo-800 transition text-sm py-1"
                href="/auth/forgot-password"
              >
                Mot de passe oublié
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

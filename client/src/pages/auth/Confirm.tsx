// Signup page
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetPageTitle } from "./../../hooks/useSetPageTitle";
import Logo from "./../../assets/png/LogoBlack.png";

interface UserData {
  page: string;
  error: boolean;
  msg: string;
  redirect?: string;
}

const Confirm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [getData, setGetData] = useState<UserData>({
    page: "",
    error: false,
    msg: "",
    redirect: "",
  });

  const { token } = useParams();
  const setPageTitle = useSetPageTitle();

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(url + `/auth/confirm/${token}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGetData(data);
      });
  }, []);

  useEffect(() => {
    if (getData.redirect) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/auth/login");
      }, 2000);
    }
  }, [getData.redirect]);

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData]);

  return (
    <div className="py-32">
      <img src={Logo} className="mx-auto w-8/12 md:w-4/12 lg:w-2/12 py-4" />
      {loading && (
        <div className="w-20 mx-auto my-40">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {/* {getData.error ? (
        <div className="max-w-md mx-auto my-10">
          {getData.msg && (
            <p
              key={getData.msg}
              className="bg-red-100 text-red-600 border border-red-600 text-sm text-center p-2 mb-1"
            >
              {getData.msg}
            </p>
          )}
        </div>
      ) : (
        getData.msg && (
          <div className="max-w-md mx-auto my-10">
            <p className="bg-green-100 text-green-600 border border-green-600 text-sm text-center p-2 mb-1">
              {getData.msg}
            </p>
          </div>
        )
      )} */}
      <div className="mt-8 mx-auto max-w-md">
        {!getData.error ? (
          <a
            className="text-indigo-600 hover:text-indigo-900 hover:font-medium transition text-md text-center uppercase mt-5 block"
            href="/auth/login"
          >
            Se connecter
          </a>
        ) : (
          <a
            className="text-indigo-600 hover:text-indigo-900 hover:font-medium transition text-md text-center uppercase mt-5 block"
            href="/"
          >
            Revenir à l'accueil
          </a>
        )}
      </div>
    </div>
  );
};

export default Confirm;

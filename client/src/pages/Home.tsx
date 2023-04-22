import { useState, useEffect } from "react";
import { useSetPageTitle } from "./../hooks/useSetPageTitle";

import Layout from "../components/Layout";

interface UserData {
  page: string;
  errors?: { msg: string }[];
  user?: {
    name: string;
    email: string;
  };
  msg: string;
}

const Home = () => {
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
    fetch(url + "/properties", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGetData(data);
      });
  }, []);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle("Home");
  }, [setPageTitle]);

  return (
    <div>
      <Layout />

      <h2 className="py-8">{getData.msg}</h2>
    </div>
  );
};

export default Home;

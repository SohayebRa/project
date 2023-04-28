import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetPageTitle } from "./../hooks/useSetPageTitle";
import Cookies from "js-cookie";

import CarouselBanner from "../components/CarouselBanner";
import Filters from "../components/Filters";
import Card from "../components/Card";

import styled, { keyframes } from "styled-components";
import { fadeInLeft, fadeInRight } from "react-animations";

const FadeInLeftDiv = styled.div`
  animation: 1s ${keyframes`${fadeInLeft}`};
`;

const FadeInRightDiv = styled.div`
  animation: 1s ${keyframes`${fadeInRight}`};
`;

const Home = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCTA, setShowCTA] = useState<boolean>(false);
  const [showCards, setShowCards] = useState<boolean>(false);

  const [getData, setGetData] = useState<HomeProps>({
    page: "",
    errors: [],
    properties: [
      {
        category: {
          id: null,
          name: "",
        },
        categoryId: null,
        description: "",
        id: "",
        image: "",
        lat: "",
        lng: "",
        parking: null,
        price: null,
        published: false,
        rooms: null,
        street: "",
        title: "",
        userId: null,
        wc: null,
      },
    ],
    msg: "",
    redirect: null,
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");
    setIsConnected(session ? true : false);

    fetch(url + "/", {
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
      navigate(getData.redirect);
    }
  }, [getData.redirect]);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData.page]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 400) {
        setShowCards(true);
      }
      if (window.scrollY >= 1400) {
        setShowCTA(true);
      }
    });
  }, []);

  const handleFilterCategory = (category: string) => {
    category &&
      fetch(url + "/filter-category", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Origin: "http://localhost:5173",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      })
        .then((response) => response.json())
        .then((data) => {
          setGetData(data);
        });
  };

  const handleFilterPrice = (price: { val1: number; val2?: number }) => {
    price &&
      fetch(url + "/filter-price", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Origin: "http://localhost:5173",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price }),
      })
        .then((response) => response.json())
        .then((data) => {
          setGetData(data);
        });
  };

  const handleSearch = (term: string) => {
    term &&
      fetch(url + "/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Origin: "http://localhost:5173",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ term }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setGetData(data);
        });
  };

  return (
    <div>
      <CarouselBanner />
      <Filters
        setLoading={setLoading}
        handleFilterCategory={handleFilterCategory}
        handleFilterPrice={handleFilterPrice}
        handleSearch={handleSearch}
      />
      <div className="w-11/12 sm:w-2/3 mx-auto py-24">
        <h2 className="text-center text-3xl font-semibold text-indigo-900 pb-12">
          Dernières annonces
        </h2>
        {loading ? (
          <div className="w-20 mx-auto my-40">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : getData.properties && getData.properties?.length > 0 ? (
          showCards ? (
            <FadeInRightDiv>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {getData.properties?.map((property) => (
                  <Card key={property.id} property={property} />
                ))}
              </div>
            </FadeInRightDiv>
          ) : (
            <div className="h-96"></div>
          )
        ) : (
          <div className="text-center text-xl text-gray-600 py-8">
            <p>Aucune annonce ne correspond à votre filtre</p>
          </div>
        )}
      </div>
      {showCTA ? (
        <FadeInLeftDiv>
          <div
            className="w-11/12 sm:w-2/3 h-[30rem] mx-auto bg-center bg-cover rounded-md mb-20 p-10 flex flex-col justify-end"
            style={{
              backgroundImage:
                "linear-gradient(316deg, #310e6898 0%, #100d3b99 74%), url('https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-1 items-center sm:items-end justify-between">
              <h2 className="text-3xl sm:text-5xl text-white font-bold uppercase text-center sm:text-start sm:w-1/2 leading-snug">
                Vous souhaitez vendre votre bien ?
              </h2>
              <br />
              <a
                href={isConnected ? "/properties/create" : "/auth/login"}
                className="bg-indigo-800 hover:bg-indigo-600 transition text-white font-semibold py-4 px-12 cursor-pointer rounded-sm"
                title={isConnected ? "Page d'ajout de propriété" : "Connexion"}
              >
                {isConnected ? "Publier une annonce" : "Connectez-vous"}
              </a>
            </div>
          </div>
        </FadeInLeftDiv>
      ) : (
        <div className="h-[30rem]"></div>
      )}
    </div>
  );
};

export default Home;

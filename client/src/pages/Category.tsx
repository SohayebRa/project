import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSetPageTitle } from "./../hooks/useSetPageTitle";
import PageTitle from "../components/PageTitle";
import Card from "../components/Card";
import { categories } from "../helpers/arrays";

import styled, { keyframes } from "styled-components";
import { fadeInUp } from "react-animations";

const FadeInUpDiv = styled.div`
  animation: 1s ${keyframes`${fadeInUp}`};
`;

const Category = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState<string>("");
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
    setShowCards(true);

    const category = categories.find((category) => category.id === id)?.name;
    category && setCategoryName(category);

    fetch(url + "/categories/" + id, {
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
  }, [id]);

  useEffect(() => {
    if (getData.redirect) {
      navigate(getData.redirect);
    }
  }, [getData.redirect]);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData.page]);

  return (
    <section>
      <PageTitle getData={getData} categoryName={categoryName} />
      <div className="w-11/12 sm:w-2/3 mx-auto pt-4 pb-24">
        {getData.properties && getData.properties?.length > 0 ? (
          showCards ? (
            <FadeInUpDiv>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {getData.properties?.map((property) => (
                  <Card key={property.id} property={property} />
                ))}
              </div>
            </FadeInUpDiv>
          ) : (
            <div className="h-96"></div>
          )
        ) : (
          <div className="text-center text-xl text-gray-600 py-8">
            <p>Aucune annonce ne correspond à votre recherche</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;

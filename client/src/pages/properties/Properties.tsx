import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSetPageTitle } from "../../hooks/useSetPageTitle";
import Cookies from "js-cookie";
import ListCard from "../../components/ListCard";
import Pagination from "../../components/Pagination";
import PageTitle from "../../components/PageTitle";

import styled, { keyframes } from "styled-components";
import { fadeInLeft, fadeInUp } from "react-animations";

const FadeInLeftDiv = styled.div`
  animation: 1s ${keyframes`${fadeInLeft}`};
`;

const FadeInUpDiv = styled.div`
  animation: 1s ${keyframes`${fadeInUp}`};
`;

const Properties = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { page } = queryString.parse(search);

  const [isProperties, setIsProperties] = useState<boolean>(false);
  const [showOne, setShowOne] = useState<boolean>(false);
  const [showTwo, setShowTwo] = useState<boolean>(false);

  const [getData, setGetData] = useState<PropertiesProps>({
    page: "",
    errors: [],
    properties: [
      {
        id: "",
        title: "",
        description: "",
        categoryId: null,
        price: null,
        rooms: null,
        wc: null,
        parking: null,
        street: null,
        lat: null,
        lng: null,
        image: "",
        published: false,
      },
    ],
    msg: "",
    redirect: "",
    pages: null,
    currentPage: 1,
    total: null,
    offset: null,
    limit: null,
  });
  const [show, setShow] = useState<boolean>(false);

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");

    fetch(url + "/properties?page=" + page, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGetData(data);
      });
  }, [page]);

  useEffect(() => {
    getData.properties &&
      getData.properties.length > 0 &&
      getData.properties[0].id !== "" &&
      setIsProperties(true);
  }, [getData.properties]);

  useEffect(() => {
    if (getData.redirect) {
      navigate(getData.redirect);
    }
  }, [getData.redirect]);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData]);

  const handleStatus = (id: string) => {
    const session = Cookies.get("_token");
    fetch(url + "/admin/" + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Mettre à jour le state
        setGetData((prev) => ({
          ...getData,
          properties: getData.properties?.map((property) =>
            property.id === data.property.id ? data.property : property
          ),
        }));
      });
  };

  const handleRemove = (id: string) => {
    const session = Cookies.get("_token");

    // Envoyer la requête
    fetch(url + "/admin/" + id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGetData((prev) => ({
          ...prev,
          properties: getData.properties?.filter(
            (property) => property.id !== data.property.id
          ),
        }));
      });
  };

  useEffect(() => {
    setShowOne(true);
    setShowTwo(true);
  }, []);

  return (
    <div className="pb-20">
      <PageTitle getData={getData} />
      <div className="mx-auto sm:container w-11/12 flex flex-col gap-8 items-start">
        {showOne && (
          <FadeInLeftDiv>
            <a
              href="/properties/create"
              className="py-4 px-6 bg-indigo-800 text-white rounded-sm text-sm font-medium uppercase flex items-center gap-2 hover:bg-indigo-600 transition"
              title="Page d'ajout de propriété"
            >
              <i className="fa-sharp fa-solid fa-plus" />
              Ajouter une propriété
            </a>
          </FadeInLeftDiv>
        )}
        <div className="mx-auto container px-4 shadow-md border">
          <div className="flex items-center flex-col gap-2 divide-y divide-gray-300 ">
            {isProperties ? (
              getData.properties?.map(
                (property) =>
                  showTwo && (
                    <FadeInUpDiv key={property.id}>
                      <ListCard
                        key={property.id}
                        property={property}
                        handleStatus={handleStatus}
                        handleRemove={handleRemove}
                      />
                    </FadeInUpDiv>
                  )
              )
            ) : (
              <p className="text-center text-gray-500 p-6">
                Il n'y a pas de propriétés à afficher
              </p>
            )}
            {getData.properties && getData.properties.length > 0 && (
              <Pagination getData={getData} isProperties={isProperties} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;

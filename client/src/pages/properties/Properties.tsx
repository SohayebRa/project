import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetPageTitle } from "../../hooks/useSetPageTitle";
import Cookies from "js-cookie";
import { categories } from "../../helpers/arrays";
import Layout from "../../components/Layout";

interface PropertyData {
  page: string;
  errors?: { msg: string }[];
  properties?: {
    id: string;
    title: string;
    description: string;
    categoryId?: number | null;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
    image: string;
    published: boolean;
  }[];
  msg: string;
  redirect?: string;
}
const Properties = () => {
  const navigate = useNavigate();
  const [isProperties, setIsProperties] = useState<boolean>(false);

  const [getData, setGetData] = useState<PropertyData>({
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
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");

    fetch(url + "/properties", {
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
  }, []);

  useEffect(() => {
    getData.properties &&
      getData.properties.length > 0 &&
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

    // Envoyer la requête
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
        // Mettre à jour le state et supprimer l'élément du tableau
        setGetData((prev) => ({
          ...getData,
          properties: getData.properties?.filter(
            (property) => property.id !== data.property.id
          ),
        }));
      });
  };

  return (
    <div>
      <Layout />

      <h2 className="text-center text-2xl font-semibold text-indigo-900 py-12">
        {getData.page}
      </h2>
      <div className="mx-auto sm:container w-11/12 flex flex-col gap-8 items-start">
        <a
          href="/properties/create"
          className="py-4 px-6 bg-indigo-800 text-white rounded-sm text-sm font-medium uppercase flex items-center gap-2 hover:bg-indigo-600 transition"
        >
          <i className="fa-sharp fa-solid fa-plus" />
          Ajouter une propriété
        </a>
        <div className="mx-auto container px-4 shadow-md border">
          <div className="flex items-center flex-col gap-2 divide-y divide-gray-300 ">
            {isProperties ? (
              getData.properties?.map((property) => (
                <div
                  key={property.id}
                  className="py-4 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
                >
                  <div className="sm:w-1/4 md:w-2/6 lg:w-1/6">
                    <img
                      src={property.image}
                      alt={`Imagen de property ${property.title}`}
                      className="rounded-sm"
                    />
                  </div>
                  <div className="sm:w-2/4 md:w-3/6 lg:w-4/6 space-y-6 flex flex-col items-start">
                    <div className="space-y-1">
                      <a
                        href={`/property/${property.id}`}
                        className="block text-xl font-bold lg:text-3xl text-indigo-800 uppercase"
                      >
                        {property.title}
                      </a>
                      <p className="text-md text-gray-500 font-medium uppercase flex items-center">
                        Prix: {property.price} €
                      </p>
                    </div>
                    <p className="text-xs px-4 py-1 bg-gray-200 text-gray-700 font-medium uppercase rounded-sm">
                      {
                        categories.find(
                          (category) =>
                            Number(category.id) === property.categoryId
                        )?.name
                      }
                    </p>
                  </div>
                  <div className="sm:w-1/4 md:w-2/6 lg:w-1/6 flex flex-col gap-2">
                    <button
                      onClick={() => handleStatus(property.id)}
                      className={`w-full rounded-sm px-3 py-2 text-xs leading-5 font-medium cursor-pointer transition  flex gap-2 items-center justify-center ${
                        property.published
                          ? "bg-green-200 text-green-700 hover:bg-green-300"
                          : "bg-yellow-200 text-yellow-700 hover:bg-yellow-300"
                      }`}
                    >
                      {property.published ? (
                        <>
                          <i className="fa-solid fa-eye" />
                          Publié
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-eye-slash" />
                          Masqué
                        </>
                      )}
                    </button>
                    <a
                      className="w-full rounded-sm px-3 py-2 text-xs text-center leading-5 font-medium cursor-pointer bg-blue-200 text-blue-700 hover:bg-blue-300 transition flex gap-2 items-center justify-center"
                      href="/properties/edit/id"
                    >
                      <i className="fa-solid fa-pen-to-square" />
                      Modifier
                    </a>
                    <button
                      onClick={() => handleRemove(property.id)}
                      className="w-full rounded-sm px-3 py-2 text-xs leading-5 font-medium cursor-pointer bg-red-200 text-red-700 hover:bg-red-300 transition flex gap-2 items-center justify-center"
                    >
                      <i className="fa-solid fa-trash" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-6">
                Il n'y a pas de propriétés à afficher
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;

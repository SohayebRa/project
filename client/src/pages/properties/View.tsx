import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetPageTitle } from "../../hooks/useSetPageTitle";
import Cookies from "js-cookie";
import { categories } from "../../helpers/arrays";
import Layout from "../../components/Layout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface PropertyData {
  page: string;
  errors?: { msg: string }[];
  property?: {
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
  };
  user: {};
  isSeller: boolean;
  msg: string;
  redirect?: string;
}
const View = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [getData, setGetData] = useState<PropertyData>({
    page: "",
    errors: [],
    property: {
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
    user: {},
    isSeller: false,
    msg: "",
    redirect: "",
  });

  const [position, setPosition] = useState<[number, number]>([
    getData.property?.lat || 48.866667,
    getData.property?.lng || 2.333333,
  ]);

  const [mapKey, setMapKey] = useState<number>(0);

  const [sent, setSent] = useState<boolean>(false);

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");

    session !== undefined
      ? fetch(url + "/property/" + id, {
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
            setPosition([data.property.lat, data.property.lng]);
            setGetData(data);
          })
      : fetch(url + "/property/" + id, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Origin: "http://localhost:5173",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setPosition([data.property.lat, data.property.lng]);
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
  }, [setPageTitle, getData]);

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1); // update key when position changes
  }, [position]);

  return (
    <div>
      <Layout />

      <div className="mx-auto sm:container w-11/12 flex flex-col gap-8 items-start">
        <div className="flex items-center flex-col gap-2 divide-y divide-gray-300 ">
          <div className="py-5">
            <h1 className="text-4xl my-10 font-bold text-indigo-800 text-center uppercase">
              {getData.property?.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-sm">
                Categorie:
              </span>
              <a
                href="/"
                className="text-xs px-4 py-1 bg-gray-200 hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 font-medium uppercase rounded-sm transition"
              >
                {
                  categories.find(
                    (category) =>
                      Number(category.id) === getData.property?.categoryId
                  )?.name
                }
              </a>
            </div>
            <div className="mt-5 md:flex md:gap-4 md:items-start">
              <div className="md:w-2/3 bg-white shadow-md">
                <img
                  src={`${getData.property?.image}`}
                  alt={`Imagen de la Propiedad: ${getData.property?.title}`}
                />
                <div className="px-5 py-6 space-y-4">
                  <p className="text-sm lg:text-lg text-gray-600">
                    {getData.property?.description}
                  </p>
                  <h2 className="text-xl lg:text-2xl leading-6 font-medium text-indigo-800">
                    Information de la propriété
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="uppercase text-gray-600 font-medium text-xs">
                      Chambres
                      <span className="text-gray-800 block text-base lg:text-lg">
                        {getData.property?.rooms}
                      </span>
                    </p>
                    <p className="uppercase text-gray-600 font-medium text-xs">
                      WC
                      <span className="text-gray-800 block text-base lg:text-lg">
                        {getData.property?.wc}
                      </span>
                    </p>
                    <p className="uppercase text-gray-600 font-medium text-xs">
                      Parking
                      <span className="text-gray-800 block text-base lg:text-lg">
                        {getData.property?.parking}
                      </span>
                    </p>
                    <p className="uppercase text-gray-600 font-medium text-xs">
                      Prix
                      <span className="text-gray-800 block text-base lg:text-lg">
                        {getData.property?.price} €
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 bg-white shadow-md">
                <div
                  style={{
                    height: "400px",
                    width: "100%",
                  }}
                  id="mapid"
                >
                  <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                    key={mapKey}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                      <Popup>
                        <span className="font-bold text-indigo-900">
                          {getData.property?.street}
                        </span>
                      </Popup>
                    </Marker>
                  </MapContainer>
                  <p className="hidden" id="lat">
                    {getData.property?.lat}
                  </p>
                  <p className="hidden" id="lng">
                    {getData.property?.lng}
                  </p>
                </div>

                <h3 className="text-center py-5 leading-6 text-xl lg:text-2xl font-medium text-indigo-800">
                  Localisation
                </h3>
                <div className="px-5 pb-5">
                  <p className="uppercase text-gray-600 font-medium text-xs">
                    Adresse
                    <span className="text-gray-800 block text-base normal-case">
                      {getData.property?.street}
                    </span>
                  </p>
                </div>
                {getData.isSeller ? (
                  <div className="px-5 pb-5 flex">
                    <a className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium uppercase text-sm w-full py-3 cursor-pointer text-center rounded-sm">
                      Voir messsages
                    </a>
                  </div>
                ) : getData.user ? (
                  <div className="px-5 pb-5">
                    {sent && (
                      <div className="px-5 pb-5">
                        <p className="bg-green-100 text-green-600 border border-green-600 text-sm text-center p-2 mb-1">
                          Message envoyé avec succès
                        </p>
                      </div>
                    )}
                    {getData.errors && (
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
                    )}
                    <form method="POST">
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="uppercase text-gray-600 font-medium text-xs"
                        >
                          Message
                        </label>
                        <textarea
                          className="w-full p-2 border border-gray-300 shadow-md placeholder-gray-400 resize-none"
                          name="message"
                          id="message"
                          placeholder="Ecrivez votre message ici"
                          rows={5}
                        ></textarea>

                        <input
                          type="submit"
                          value="Envoyer"
                          className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium uppercase text-sm w-full py-3 cursor-pointer text-center rounded-sm"
                        />
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="px-5 pb-5">
                    <label className="uppercase text-gray-600 font-medium text-xs ">
                      Message
                    </label>
                    <div className="flex flex-col items-center lg:items-start lg:flex-row justify-centeer gap-1">
                      <p className="text-gray-600 text-sm lg:text-base">
                        Si vous souhiatez contacter le vendeur
                      </p>
                      <a
                        href="/auth/login"
                        className="text-indigo-800 text-sm lg:text-base font-medium"
                      >
                        Connectez-vous
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;

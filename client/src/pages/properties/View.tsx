import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetPageTitle } from "../../hooks/useSetPageTitle";
import Cookies from "js-cookie";
import { categories } from "../../helpers/arrays";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MessageForm from "../../components/MessageForm";
import ViewCard from "../../components/ViewCard";

const View = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [getData, setGetData] = useState<ViewProps>({
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
    user: {
      id: null,
      name: "",
      email: "",
    },
    isSeller: false,
    msg: "",
    redirect: "",
  });

  const [position, setPosition] = useState<[number, number]>([
    getData.property?.lat || 48.866667,
    getData.property?.lng || 2.333333,
  ]);

  const [mapKey, setMapKey] = useState<number>(0);

  const [message, setMessage] = useState<string>("");

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
            setGetData(data);
            !data.redirect &&
              setPosition([data.property.lat, data.property.lng]);
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
            setGetData(data);
            !data.redirect &&
              setPosition([data.property.lat, data.property.lng]);
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
    getData.property &&
      getData.property.lat &&
      getData.property.lng &&
      setPosition([getData.property.lat, getData.property.lng]);
  }, [getData.property, getData.property]);

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [position]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const session = Cookies.get("_token");

    const response = await fetch(url + "/messages/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage("");
        setGetData(data);
        setTimeout(() => {
          setGetData((prevData) => ({ ...prevData, msg: "" }));
        }, 3000);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="pb-20">
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
                title="Page d'Accueil"
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
              <ViewCard getData={getData} />

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
                    <a
                      href={`/messages/${id}`}
                      className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium uppercase text-sm w-full py-3 cursor-pointer text-center rounded-sm"
                      title="Page de messages de l'annonce"
                    >
                      Voir messsages
                    </a>
                  </div>
                ) : getData.user ? (
                  <div className="px-5 pb-5">
                    <MessageForm
                      handleSubmit={handleSubmit}
                      getData={getData}
                      message={message}
                      setMessage={setMessage}
                    />
                  </div>
                ) : (
                  <div className="px-5 pb-5">
                    <span className="uppercase text-gray-600 font-medium text-xs ">
                      Message
                    </span>
                    <div className="flex flex-col items-center lg:items-start lg:flex-row justify-centeer gap-1">
                      <p className="text-gray-600 text-sm lg:text-base">
                        Si vous souhiatez contacter le vendeur
                      </p>
                      <a
                        href="/auth/login"
                        className="text-indigo-800 text-sm lg:text-base font-medium"
                        title="Connexion"
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

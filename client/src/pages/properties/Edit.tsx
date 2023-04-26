// Property create form
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useSetPageTitle } from "../../hooks/useSetPageTitle";
import { categories } from "../../helpers/arrays";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import PageTitle from "../../components/PageTitle";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [getData, setGetData] = useState<EditProps>({
    page: "",
    errors: [],
    property: {
      title: "",
      description: "",
      categoryId: "",
      price: null,
      rooms: null,
      wc: null,
      parking: null,
      street: null,
      lat: null,
      lng: null,
    },
    msg: "",
    redirect: "",
    id: null,
  });

  const [formData, setFormData] = useState({
    title: getData.property?.title || "",
    description: getData.property?.description || "",
    category: getData.property?.categoryId || "",
    price: getData.property?.price || 0,
    rooms: getData.property?.rooms || 0,
    wc: getData.property?.wc || 0,
    parking: getData.property?.parking || 0,
    street: getData.property?.street || "",
    lat: getData.property?.lat || 48.866667,
    lng: getData.property?.lng || 2.333333,
  });

  const [lat, setLat] = useState(getData.property?.lat || 48.866667);
  const [lng, setLng] = useState(getData.property?.lng || 2.333333);

  const [position, setPosition] = useState<[number, number]>([
    lat || 48.866667,
    lng || 2.333333,
  ]);

  const handleMarkerDragEnd = async (e: any) => {
    const newPosition = e.target.getLatLng();
    setLat(newPosition.lat);
    setLng(newPosition.lng);

    setFormData((prevState) => ({
      ...prevState,
      lat: newPosition.lat,
      lng: newPosition.lng,
    }));

    setPosition([newPosition.lat, newPosition.lng]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newPosition.lat}&lon=${newPosition.lng}`
      );
      const addressData = await response.json();
      const { road, house_number, city, town, postcode, country } =
        addressData.address;

      const fullAdress = `${house_number && house_number ? house_number : ""} ${
        road && road ? `${road},` : ""
      } ${postcode && postcode ? postcode : ""} ${
        town && town ? `${town},` : city && city ? `${city},` : ""
      } ${country && country ? country : ""}`;

      setFormData((prevState) => ({
        ...prevState,
        street: fullAdress,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");

    fetch(url + "/admin/edit/" + id, {
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
    setFormData({
      title: getData.property?.title || "",
      description: getData.property?.description || "",
      category: getData.property?.categoryId || "",
      price: getData.property?.price || 0,
      rooms: getData.property?.rooms || 0,
      wc: getData.property?.wc || 0,
      parking: getData.property?.parking || 0,
      street: getData.property?.street || "",
      lat: getData.property?.lat || 48.866667,
      lng: getData.property?.lng || 2.333333,
    });

    getData.property?.lat &&
      getData.property?.lng &&
      setPosition([getData.property?.lat, getData.property?.lng]);
  }, [getData]);

  useEffect(() => {
    if (getData.redirect) {
      navigate(getData.redirect);
    }
  }, [getData.redirect]);

  useEffect(() => {
    if (getData.id !== undefined && getData.id !== null) {
      const id = getData.id;
      setGetData({ ...getData, id: null });
      navigate(`/properties/add-image/${id}`);
    }
  }, [getData.id]);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const session = Cookies.get("_token");

    const response = await fetch(url + "/admin/edit/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setGetData(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="pb-12">
      <PageTitle getData={getData} />
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
      <div className="mx-auto max-w-4xl my-10 px-4 md:px-10">
        <div className="bg-white py-8 px-4  shadow-md border border-[1] rounded-md">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <h3 className="text-lg leading-6 font-normal text-gray-900 text-center">
                Information générale
              </h3>
              <p className="text-gray-500 text-center">
                Modifiez les informations de votre propriété
              </p>
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm uppercase text-gray-500 mb-2 font-medium"
              >
                Titre de l'Annonce
              </label>
              <input
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                placeholder="Titre de la propriété: ex: 'Maison de 3 chambres'"
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm uppercase text-gray-500 mb-2 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                placeholder="Décrivez la propriété en quelques phrases"
                name="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  });
                }}
              ></textarea>
            </div>
            <div className="md:flex md:gap-6 space-y-6 md:space-y-0">
              <div className="md:w-1/2">
                <label
                  htmlFor="category"
                  className="block text-sm uppercase text-gray-500 mb-2 font-medium"
                >
                  Catégorie
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    });
                  }}
                >
                  <option value="">-- Sélectionnez --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-1/2">
                <label
                  htmlFor="price"
                  className="block text-sm uppercase text-gray-500 mb-2 font-medium"
                >
                  Prix
                </label>
                <input
                  id="price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                  placeholder="Prix de la propriété: ex: 100000€"
                  type="number"
                  name="price"
                  value={formData.price?.toString()}
                  onChange={(e) => {
                    const valuePrice = e.target.value;
                    {
                      valuePrice === ""
                        ? setFormData({
                            ...formData,
                            price: 0,
                          })
                        : setFormData({
                            ...formData,
                            price: parseFloat(valuePrice),
                          });
                    }
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:gap-6 space-y-6 md:space-y-0">
              <div className="md:w-1/2">
                <label
                  htmlFor="rooms"
                  className="block text-sm uppercase text-gray-500 mb-2 font-medium"
                >
                  Chambres
                </label>
                <select
                  id="rooms"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                  name="rooms"
                  value={formData.rooms?.toString()}
                  onChange={(e) => {
                    const valueRooms = e.target.value;
                    {
                      valueRooms === ""
                        ? setFormData({
                            ...formData,
                            rooms: 0,
                          })
                        : setFormData({
                            ...formData,
                            rooms: parseFloat(valueRooms),
                          });
                    }
                  }}
                >
                  <option value="">-- Sélectionnez --</option>
                  10
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-1/2">
                <label
                  htmlFor="wc"
                  className="block text-sm uppercase text-gray-500 mb-2 font-medium"
                >
                  WC
                </label>
                <select
                  id="wc"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                  name="wc"
                  value={formData.wc?.toString()}
                  onChange={(e) => {
                    const valueWc = e.target.value;
                    {
                      valueWc === ""
                        ? setFormData({
                            ...formData,
                            wc: 0,
                          })
                        : setFormData({
                            ...formData,
                            wc: parseFloat(valueWc),
                          });
                    }
                  }}
                >
                  <option value="">-- Sélectionnez --</option>
                  10
                  {[...Array(6)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-1/2">
                <label
                  htmlFor="parking"
                  className="block text-sm uppercase text-gray-500 mb-2 font-medium"
                >
                  Parking
                </label>
                <select
                  id="parking"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400"
                  name="parking"
                  value={formData.parking?.toString()}
                  onChange={(e) => {
                    const valueParking = e.target.value;
                    {
                      valueParking === ""
                        ? setFormData({
                            ...formData,
                            parking: 0,
                          })
                        : setFormData({
                            ...formData,
                            parking: parseFloat(valueParking),
                          });
                    }
                  }}
                >
                  <option value="">-- Sélectionnez --</option>
                  10
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1 border-gray-200 border-t pt-5">
              <h3 className="text-lg leading-6 font-normal text-gray-900 text-center">
                Localisation
              </h3>
              <p className="text-gray-500 text-center">
                Modifiez la localisation de votre propriété en déplaçant le
                marqueur
              </p>
            </div>
            <div
              id="mapid"
              style={{
                height: "400px",
                width: "100%",
              }}
            >
              <MapContainer
                center={position}
                zoom={7}
                scrollWheelZoom={true}
                dragging={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[Number(lat), Number(lng)]}
                  draggable={true}
                  eventHandlers={{ dragend: handleMarkerDragEnd }}
                >
                  <Popup autoPan={true}>
                    <strong className="font-bold text-indigo-900 ">
                      {formData.street}
                    </strong>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400 text-gray-500"
              type="text"
              name="street"
              id="street"
              placeholder="Déplacez le marqueur sur la carte pour localiser votre propriété"
              value={formData.street}
              onChange={(e) => {}}
              disabled
            />
            <input
              type="hidden"
              name="lat"
              id="lat"
              value={formData.lat}
              onChange={(e) => {
                const valueLat = Number(e.target.value);
                setFormData({
                  ...formData,
                  lng: valueLat,
                });
              }}
            />
            <input
              type="hidden"
              name="lng"
              id="lng"
              value={formData.lng}
              onChange={(e) => {
                const valueLng = Number(e.target.value);
                setFormData({
                  ...formData,
                  lng: valueLng,
                });
              }}
            />

            <input
              className="w-full bg-indigo-900 hover:bg-indigo-700 transition text-white font-medium py-3 cursor-pointer uppercase"
              type="submit"
              value="Sauvegarder les modifications"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;

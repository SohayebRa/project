// Property create form
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useSetPageTitle } from "./../../hooks/useSetPageTitle";
import Layout from "../../components/Layout";
import Dropzone, { FileWithPath } from "react-dropzone";

interface PropertyData {
  page: string;
  errors?: { msg: string }[];
  property?: {
    title: string;
    description: string;
    category?: string | null;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
  };
  msg: string;
  redirect?: string;
}

const AddImage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState<FileWithPath | null>(null);

  const [getData, setGetData] = useState<PropertyData>({
    page: "",
    errors: [],
    property: {
      title: "",
      description: "",
      category: null,
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
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");

    fetch(url + "/admin/add-image/" + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setGetData(data));
  }, []);

  if (getData.redirect) {
    navigate(getData.redirect);
  }

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData]);

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles[0]);
  };

  const handleRemove = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const session = Cookies.get("_token");

    const formData = new FormData();
    if (file !== null) {
      formData.append("image", file);
    }

    // Console log the size of formData
    console.log(formData, formData.get("image"));

    const response = await fetch(url + "/admin/add-image/" + id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session}`,
      },
      body: formData,
    })
      .then((response) => {
        navigate("/properties");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Layout />
      <h2 className="text-center text-2xl font-semibold text-indigo-900 pt-12">
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
      <div className="mx-auto max-w-4xl my-10 md:px-10">
        <div className="bg-white py-8 px-4  shadow-md border border-[1] rounded-md">
          <form className="space-y-5" method="POST" onSubmit={handleSubmit}>
            <div className="space-y-1 h-36 border-gray-300  border-dashed border-2 rounded-md flex items-center justify-center text-gray-500">
              <Dropzone onDrop={handleDrop} maxFiles={1} maxSize={5242880}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="h-full w-full">
                    {file ? (
                      <div className="h-full w-full flex flex-wrap items-start p-3">
                        <div className="relative mr-4 mb-4">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="object-cover h-24 w-24 rounded-md"
                          />
                          <button
                            className="absolute top-1 right-1 rounded-full bg-red-200 text-red-900 hover:bg-red-400 hover:text-red-900 w-6 h-6 flex justify-center items-center"
                            onClick={() => handleRemove()}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M13.707 6.293a1 1 0 010 1.414L11.414 10l2.293 2.293a1 1 0 11-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 011.414-1.414L10 8.586l2.293-2.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <p className="mt-1 text-sm text-end">{file.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full cursor-pointer">
                        <input {...getInputProps()} name="image" />
                        <p className="text-gray-400">
                          Déposez vos images ici, ou cliquez pour les importer
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            </div>

            <input
              className="w-full bg-indigo-900 hover:bg-indigo-700 transition text-white font-medium py-3 cursor-pointer uppercase"
              type="submit"
              value="Publier la propriété"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default AddImage;

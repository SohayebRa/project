import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetPageTitle } from "../../hooks/useSetPageTitle";
import Cookies from "js-cookie";
import PageTitle from "../../components/PageTitle";
import Message from "../../components/Message";

const Messages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMessages, setIsMessages] = useState<boolean>(false);

  const [getData, setGetData] = useState<MessagesProps>({
    page: "",
    errors: [],
    messages: [
      {
        id: null,
        message: "",
        createdAt: "2023-04-22T10:07:40.000Z",
        propertyId: "",
        user: {
          id: 1,
          name: "",
          email: "",
        },
      },
    ],
    msg: "",
    redirect: "",
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");

    fetch(url + "/messages/" + id, {
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
    getData.messages && getData.messages.length > 0 && setIsMessages(true);
  }, [getData.messages]);

  useEffect(() => {
    if (getData.redirect) {
      navigate(getData.redirect);
    }
  }, [getData.redirect]);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData]);

  return (
    <div className="pb-20">
      <PageTitle getData={getData} />
      <div className="mx-auto max-w-4xl">
        {" "}
        <a
          href={`/property/${id}`}
          className="py-3 px-10 bg-indigo-800 hover:bg-indigo-600 transition text-sm font-medium text-center text-white my-10 inline-block w-full sm:w-auto"
        >
          Revenir
        </a>
        {isMessages ? (
          <ul>
            {getData.messages?.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 p-5">
            Aucun message pour cette propriété
          </p>
        )}
      </div>
    </div>
  );
};
export default Messages;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetPageTitle } from "../../hooks/useSetPageTitle";
import Cookies from "js-cookie";
import PageTitle from "../../components/PageTitle";
import { formatDate } from "../../helpers/formatDate";

const Messages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMessages, setIsMessages] = useState<boolean>(false);
  const [currentChat, setCurrentChat] = useState<number | null>(null);

  const [getData, setGetData] = useState<MessagesProps>({
    page: "",
    errors: [],
    messages: [],
    msg: "",
    redirect: "",
  });

  const userId = Cookies.get("user_id");
  const key = `propiedad_${id}_usuario_${userId}`;

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
    <div className="pb-20 space-y-4">
      <PageTitle getData={getData} />
      <div className="mx-auto max-w-4xl space-y-8 flex flex-col items-center px-4 sm:items-start">
        {" "}
        <a
          href={`/property/${id}`}
          className="py-4 px-10 bg-indigo-800 hover:bg-indigo-600 transition text-sm font-medium text-center text-white w-full rounded-sm"
          title="Revenir à la page de l'annonce"
        >
          Revenir à l'annonce
        </a>
        {isMessages ? (
          <div className="flex items-center h-[36rem] w-full mb-12">
            <div
              className={`sm:flex flex-col w-full sm:w-4/12 bg-slate-200 h-full rounded-sm ${
                currentChat ? "hidden" : "flex"
              }`}
            >
              <button
                className="py-4 bg-indigo-800 text-white font-semibold"
                onClick={() => setCurrentChat(null)}
              >
                Conversations
              </button>
              <div className="flex flex-col divide-y divide-gray-300 h-full">
                {getData.messages?.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => {
                      setCurrentChat(message.id);
                    }}
                    className="flex justify-between items-center px-5 py-3 hover:bg-slate-300 transition"
                  >
                    <div className="flex flex-col items-start">
                      <h3 className="text-indigo-800 font-medium">
                        {message.name}
                      </h3>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#3730a3"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div
              className={`sm:flex flex-col w-full sm:w-8/12 bg-slate-100 h-full rounded-sm ${
                currentChat ? "flex" : "hidden"
              } `}
            >
              <div className="text-center py-4 bg-gray-900 text-white font-semibold flex items-center justify-between sm:justify-center px-4">
                Messages
                <button
                  className={`text-white font-semibold sm:hidden ${
                    currentChat ? "flex" : "hidden"
                  }`}
                  onClick={() => setCurrentChat(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </div>
              {currentChat ? (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex flex-col overflow-y-scroll pb-4 h-full">
                    {getData.messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col items-start px-5 py-3 gap-6 ${
                          message.id === currentChat ? "flex" : "hidden"
                        }`}
                      >
                        {message.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className="flex flex-col items-start gap-2 w-1/2"
                          >
                            <p className="text-xs text-gray-500">
                              {formatDate(msg.createdAt)
                                .charAt(0)
                                .toUpperCase() +
                                formatDate(msg.createdAt)
                                  .slice(1)
                                  .toLowerCase()}
                            </p>
                            <div className="px-3 py-2 bg-slate-200 rounded-md">
                              <p className="text-sm text-gray-600">
                                {msg.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex items-center w-full"
                    onSubmit={(e) => e.preventDefault}
                  >
                    <input
                      type="text"
                      placeholder="Taper un message"
                      className="w-3/4 py-3 px-4 bg-gray-700 placeholder:text-gray-300 focus:outline-none"
                    />
                    <input
                      type="submit"
                      value="Envoyer"
                      className="w-1/4 py-3 bg-gray-900 text-white cursor-pointer hover:bg-indigo-800 transition"
                    />
                  </form>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-60">
                  Sélectionnez une conversation
                </p>
              )}
            </div>
          </div>
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

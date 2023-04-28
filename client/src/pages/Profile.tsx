import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetPageTitle } from "./../hooks/useSetPageTitle";
import useApp from "../hooks/useApp";
import PageTitle from "../components/PageTitle";
import Cookies from "js-cookie";
import { formatDate } from "../helpers/formatDate";

import styles from "../Profile.module.css";
import styled, { keyframes } from "styled-components";
import { fadeInLeft, fadeInRight } from "react-animations";

const FadeInLeftDiv = styled.div`
  animation: 1s ${keyframes`${fadeInLeft}`};
`;

const FadeInRightDiv = styled.div`
  animation: 1s ${keyframes`${fadeInRight}`};
`;

const Profile = () => {
  const navigate = useNavigate();
  const { setCookie } = useApp();
  const [showOne, setShowOne] = useState<boolean>(false);
  const [showTwo, setShowTwo] = useState<boolean>(false);

  const [getData, setGetData] = useState<ProfileProps>({
    page: "",
    errors: [],
    user: {
      id: null,
      name: "",
      email: "",
      createdAt: "",
    },
    messages: [
      {
        id: null,
        message: "",
        checked: false,
        createdAt: "",
        propertyId: "",
        userInfo: {
          id: null,
          name: "",
          email: "",
        },
      },
    ],
    msg: "",
    redirect: null,
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const session = Cookies.get("_token");

    fetch(url + "/profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
        Authorization: "Bearer " + session,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGetData(data);
      });
  }, []);

  useEffect(() => {
    if (getData.redirect) {
      logout();
    }
  }, [getData.redirect]);

  const setPageTitle = useSetPageTitle();

  useEffect(() => {
    setPageTitle(getData.page);
  }, [setPageTitle, getData.page]);

  const logout = () => {
    setCookie({ name: "_token", value: "" });
    navigate("/");
  };

  const handleDeleteAccount = () => {
    const session = Cookies.get("_token");

    fetch(url + "/delete-account/" + getData.user?.id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
        Authorization: "Bearer " + session,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGetData(data);
      });
  };

  const handleChecked = (id: number, propertyId: string) => {
    const session = Cookies.get("_token");

    fetch(url + "/checked/" + id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Origin: "http://localhost:5173",
        "Content-Type": "application/json",
        Authorization: "Bearer " + session,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newMessages = getData.messages.filter(
          (message) => message.id !== data.msg
        );
        setGetData({ ...getData, messages: newMessages });
        navigate("/messages/" + propertyId);
      });
  };

  useEffect(() => {
    setShowOne(true);
    setShowTwo(true);
  }, []);

  return (
    <section className={styles.section}>
      <PageTitle getData={getData} />
      <div className={styles.container}>
        <h2>Données personnelles :</h2>
        {showOne && (
          <FadeInLeftDiv>
            <table className={styles.informations}>
              <tbody>
                <tr>
                  <td className={styles.tableInfo}>Nom :</td>
                  <td className={styles.tableValue}>{getData.user?.name}</td>
                </tr>
                <tr>
                  <td className={styles.tableInfo}>Email :</td>
                  <td className={styles.tableValue}>{getData.user?.email}</td>
                </tr>
                <tr>
                  <td className={styles.tableInfo}>
                    Date de création du compte :
                  </td>
                  <td className={styles.tableValue}>
                    {getData.user?.createdAt &&
                      formatDate(getData.user?.createdAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </FadeInLeftDiv>
        )}
        <h2>Paramètres du compte :</h2>
        {showTwo && (
          <FadeInRightDiv>
            <table className={styles.informations}>
              <tbody>
                <tr>
                  <td className={styles.tableInfo}>
                    Changer le mot de passe :
                  </td>
                  <td className={styles.tableValue}>•••••••••••••••</td>
                  <td className={styles.tableAction}>
                    <i className="fa-solid fa-pen-to-square" />
                  </td>
                </tr>
                <tr>
                  <td className={styles.tableInfo}>Supprimer mon compte :</td>
                  <td className={styles.tableValue}>
                    Cette action est irréversible
                  </td>
                  <td
                    className={styles.tableAction}
                    onClick={handleDeleteAccount}
                  >
                    <i className="fa-solid fa-trash" />
                  </td>
                </tr>
              </tbody>
            </table>
          </FadeInRightDiv>
        )}
        <h2>Messages reçu :</h2>
        {showOne && (
          <FadeInLeftDiv>
            {getData.messages.length > 0 ? (
              <table className={styles.informations}>
                <tbody>
                  {getData.messages?.map((message) => (
                    <tr key={message.id}>
                      <td className={styles.tableInfo}>
                        Message de : {message.userInfo.name}
                      </td>
                      <td className={styles.tableValue}>{message.message}</td>
                      <td
                        className={styles.tableAction}
                        onClick={() => {
                          message.id &&
                            handleChecked(message.id, message.propertyId);
                        }}
                      >
                        <i className="fa-solid fa-circle-check"></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-xl text-gray-600 py-8">
                <p>Vous n'avez pas de nouveaux messages</p>
              </div>
            )}
          </FadeInLeftDiv>
        )}
        <div className={styles.buttons}>
          <a href="/properties" title="Page de mes propriétés">
            Mes propriétés
          </a>

          <button onClick={logout}>
            <i className="fa-solid fa-power-off"></i>
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;

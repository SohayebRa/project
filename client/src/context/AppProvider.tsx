// App Provider Context
import { ReactNode, createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AppContextProps {
  cookie?: {
    name: string;
    value: string;
  };
  setCookie: (cookie: { name: string; value: string }) => void;
  session: boolean;
}

type ChildrenProps = {
  children: ReactNode;
};

const AppContext = createContext<AppContextProps>({
  cookie: {
    name: "",
    value: "",
  },
  setCookie: () => {},
  session: false,
});

const AppProvider = ({ children }: ChildrenProps) => {
  const [session, setSession] = useState<boolean>(false);
  const [cookie, setCookie] = useState({
    name: "",
    value: "",
  });

  useEffect(() => {
    if (cookie.value) {
      Cookies.set(cookie.name, cookie.value, { expires: 1 });
    } else {
      Cookies.remove(cookie.name);
    }
  }, [cookie]);

  useEffect(() => {
    const updateSession = () => {
      const tokenCookie = Cookies.get("_token");
      setSession(Boolean(tokenCookie));
    };

    const timeoutId = setTimeout(() => {
      updateSession();
    }, 5000);

    updateSession();

    return () => clearTimeout(timeoutId);
  }, [cookie, session]);

  // prettier-ignore
  return (
        <AppContext.Provider
            value={{
                cookie,
                setCookie,
                session
            }}
        >
            {children}
        </AppContext.Provider>
    )
};

export { AppProvider };
export default AppContext;

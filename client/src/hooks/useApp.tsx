import { useContext } from "react";
import AppContext from "../context/AppProvider";

// useApp hook
const useApp = () => {
  return useContext(AppContext);
};

export default useApp;

import { useEffect, useState } from "react";

export function useSetPageTitle() {
  const [pageTitle, setPageTitle] = useState<string>("");

  useEffect(() => {
    document.title = `Estate Owl - ${pageTitle}`; // Mettre à jour le titre de la page
  }, [pageTitle]);

  return setPageTitle;
}

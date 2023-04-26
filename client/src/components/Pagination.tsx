interface PaginationProps {
  getData: {
    pages: number | null;
    currentPage: number | null;
    total: number | null;
  };
  isProperties: boolean;
}

const Pagination = ({ getData, isProperties }: PaginationProps) => {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 w-full">
      {isProperties ? (
        <>
          <div className="flex-1 flex justify-between sm:hidden">
            <a
              href={`/properties?page=${
                getData.currentPage && getData.currentPage - 1
              }`}
              className={`${
                getData.currentPage === 1 ? "pointer-events-none" : ""
              } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-normal text-gray-700 bg-white hover:bg-gray-200`}
            >
              Prècèdent
            </a>
            <a
              href={`/properties?page=${
                getData.currentPage && getData.currentPage + 1
              }`}
              className={`${
                getData.currentPage === getData.pages
                  ? "pointer-events-none"
                  : ""
              } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-normal text-gray-700 bg-white hover:bg-gray-200`}
            >
              Suivant
            </a>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700 gap-2">
              <span className="font-normal">{getData.total} Résultats</span>
            </p>
          </div>
          <div className="hidden sm:block">
            <nav className="relative z-0 inline-flex shadow-md">
              {getData.pages &&
                Array.from({ length: getData.pages }, (_, i) => (
                  <a
                    key={i}
                    href={`/properties?page=${i + 1}`}
                    className={`${
                      getData.currentPage === i + 1
                        ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                        : "bg-white hover:bg-gray-100 border-gray-200 text-gray-700"
                    } relaive inline-flex items-center px-4 py-2 border text-sm`}
                  >
                    {i + 1}
                  </a>
                ))}
            </nav>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-700 gap-2">
          <span className="font-normal">0 Résultats</span>
        </p>
      )}
    </div>
  );
};

export default Pagination;

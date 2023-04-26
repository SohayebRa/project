import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, prices } from "../helpers/arrays";

interface FiltersProps {
  handleSearch: (categoryId: string) => void;
  handleFilterCategory: (categoryId: string) => void;
  handleFilterPrice: (price: { val1: number; val2?: number }) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters = ({
  handleFilterCategory,
  handleFilterPrice,
  handleSearch,
  setLoading,
}: FiltersProps) => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [priceValue, setPriceValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setCategoryId("");
  }, []);

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (e.target.value === "") {
      return navigate("/");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    handleFilterCategory(e.target.value);
    setCategoryId(e.target.value);
    setPriceValue("");
    setSearchTerm("");
  };

  const handlePriceFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (e.target.value === "") {
      return navigate("/");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    const price = prices.find((price) => price.name === e.target.value);
    price && handleFilterPrice(price.value);
    setPriceValue(e.target.value);
    setCategoryId("");
    setSearchTerm("");
  };

  const handleSearchBar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchTerm === "") {
      return navigate("/");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    handleSearch(searchTerm);
    setCategoryId("");
    setPriceValue("");
  };

  return (
    <div className="py-12 bg-indigo-900">
      <div className="container mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-8 sm:gap:4">
        <div className="w-full sm:w-1/2 flex flex-col sm:flex-row items-center gap-3">
          <h2 className="text-lg sm:text-sm uppercase text-gray-100 font-medium">
            Affiner par :
          </h2>
          <div className="px-4 w-full sm:w-2/5 flex items-center">
            <select
              id="categories"
              className="bg-gray-200 w-full px-3 py-2 border border-gray-300 font-semibold text-indigo-800 shadow-md"
              value={categoryId}
              onChange={handleCategoryFilter}
            >
              <option value="">CATEGORIES</option>
              {categories.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>
          <div className="px-4 w-full sm:w-2/5 flex items-center">
            <select
              id="prices"
              className="bg-gray-200 w-full px-3 py-2 border border-gray-300 font-semibold text-indigo-800 shadow-md"
              value={priceValue}
              onChange={handlePriceFilter}
            >
              <option value="">PRIX</option>
              {prices.map((price) => (
                <option key={price.name} value={price.name}>
                  {price.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <form
          className="flex items-center w-full px-4 sm:w-2/5 sm:px-0"
          onSubmit={handleSearchBar}
        >
          <input
            type="text"
            name="search"
            placeholder="Chercher par ville ou code postal"
            className="py-4 px-5 text-base shadow-md rounded-sm w-4/6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-800 transition text-white font-medium py-4 px-5 cursor-pointer text-base rounded-sm w-2/6 shadow-md"
            value="Chercher"
          />
        </form>
      </div>
    </div>
  );
};
export default Filters;

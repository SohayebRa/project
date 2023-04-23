import { useEffect, useState } from "react";
import { categories, prices } from "../helpers/arrays";

interface FiltersProps {
  handleFilter: (categoryId: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters = ({ handleFilter, setLoading }: FiltersProps) => {
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    setCategoryId("");
  }, []);

  return (
    <div className="py-12 bg-indigo-900">
      <div className="container mx-auto flex flex-col sm:flex-row items-center sm:justify-center gap-4">
        <h2 className="text-lg sm:text-sm uppercase text-gray-100 font-medium">
          Trier par :
        </h2>
        <div className="px-6 w-full sm:w-1/5 flex items-center gap-2">
          <select
            id="categories"
            className="bg-gray-200 w-full px-3 py-2 border border-gray-300 font-semibold text-indigo-800 shadow-md"
            value={categoryId}
            onChange={(e) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
              handleFilter(e.target.value);
              setCategoryId(e.target.value);
            }}
          >
            <option value="">CATEGORIES</option>
            {categories.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </div>
        <div className="px-6 w-full sm:w-1/5 flex items-center gap-2">
          <select
            id="prices"
            className="bg-gray-200 w-full px-3 py-2 border border-gray-300 font-semibold text-indigo-800 shadow-md"
          >
            <option value="">PRIX</option>
            {prices.map((price) => (
              <option key={price.value} value={price.value}>
                {price.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
export default Filters;

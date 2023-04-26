import { categories } from "../helpers/arrays";

interface NavbarProps {
  navigate: (path: string) => void;
  categoryId: number;
  setCategoryId: (categoryId: number) => void;
}

const Navbar = ({ navigate, categoryId, setCategoryId }: NavbarProps) => {
  return (
    <div className="bg-indigo-50 py-5 lg:block border-t border-slate-300 mt-2">
      <div className="container mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
        <nav className="sm:flex sm:flex-wrap sm:gap-6 hidden">
          <a
            href="/categories/1"
            className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
          >
            Maisons
          </a>
          <a
            href="/categories/2"
            className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
          >
            Appartements
          </a>
          <a
            href="/categories/3"
            className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
          >
            Entrepôts
          </a>
          <a
            href="/categories/4"
            className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
          >
            Bureaux
          </a>
          <a
            href="/categories/5"
            className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
          >
            Terrains
          </a>
          <a
            href="/categories/6"
            className="text-sm font-medium uppercase text-indigo-800 hover:text-indigo-600 transition"
          >
            Cabanes
          </a>
        </nav>
        <select
          className="text-md font-medium uppercase border text-indigo-800 hover:text-indigo-600 transition sm:hidden p-4 w-full rounded-sm shadow-md"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(Number(e.target.value));
            const category = categories.find(
              (category) => category.id === e.target.value
            );
            if (category) {
              navigate(`/categories/${category.id}`);
            }
          }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Navbar;

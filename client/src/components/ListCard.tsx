import { categories } from "../helpers/arrays";

interface ListCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    categoryId?: number | null;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
    image: string;
    published: boolean;
  };
  handleStatus: (id: string) => void;
  handleRemove: (id: string) => void;
}

const ListCard = ({ property, handleStatus, handleRemove }: ListCardProps) => {
  const { title, image, price, id } = property;
  return (
    <div className="py-4 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div className="sm:w-1/4 md:w-2/6 lg:w-1/6">
        <img
          src={property.image}
          alt={`Imagen de property ${property.title}`}
          className="rounded-sm"
        />
      </div>
      <div className="sm:w-2/4 md:w-3/6 lg:w-4/6 space-y-6 flex flex-col items-start">
        <div className="space-y-1">
          <a
            href={`/property/${property.id}`}
            className="block text-xl font-bold lg:text-3xl text-indigo-800 uppercase"
          >
            {property.title}
          </a>
          <p className="text-md text-gray-500 font-medium uppercase flex items-center">
            Prix: {property.price} €
          </p>
        </div>
        <p className="text-xs px-4 py-1 bg-gray-200 text-gray-700 font-medium uppercase rounded-sm">
          {
            categories.find(
              (category) => Number(category.id) === property.categoryId
            )?.name
          }
        </p>
      </div>
      <div className="sm:w-1/4 md:w-2/6 lg:w-1/6 flex flex-col gap-2">
        <button
          onClick={() => handleStatus(property.id)}
          className={`w-full rounded-sm px-3 py-2 text-xs leading-5 font-medium cursor-pointer transition  flex gap-2 items-center justify-center ${
            property.published
              ? "bg-green-200 text-green-700 hover:bg-green-300"
              : "bg-yellow-200 text-yellow-700 hover:bg-yellow-300"
          }`}
        >
          {property.published ? (
            <>
              <i className="fa-solid fa-eye" />
              Publié
            </>
          ) : (
            <>
              <i className="fa-solid fa-eye-slash" />
              Masqué
            </>
          )}
        </button>
        <a
          className="w-full rounded-sm px-3 py-2 text-xs text-center leading-5 font-medium cursor-pointer bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition flex gap-2 items-center justify-center"
          href={`/properties/edit/${property.id}`}
        >
          <i className="fa-solid fa-pen-to-square" />
          Modifier
        </a>
        <button
          onClick={() => handleRemove(property.id)}
          className="w-full rounded-sm px-3 py-2 text-xs leading-5 font-medium cursor-pointer bg-red-200 text-red-700 hover:bg-red-300 transition flex gap-2 items-center justify-center"
        >
          <i className="fa-solid fa-trash" />
          Supprimer
        </button>
      </div>
    </div>
  );
};
export default ListCard;

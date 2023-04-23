import { prices } from "../helpers/arrays";
interface PropertyProps {
  property: {
    id: string;
    title: string;
    description: string;
    image: string;
    categoryId: number | null;
    price: number | null;
    category: {
      id: number | null;
      name: string;
    };
  };
}

const Card = ({ property }: PropertyProps) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-sm shadow">
      <a href={`/property/${property.id}`}>
        <img
          className="h-60 w-full"
          src={property.image}
          alt={`Image of ${property.title}`}
        />
      </a>
      <div className="p-5 flex flex-col gap-4">
        <a href={`/property/${property.id}`}>
          <h5 className="text-2xl font-bold tracking-tight text-indigo-800 uppercase truncate">
            {property.title}
          </h5>
        </a>
        <p className="font-semibold text-gray-400">{property.description}</p>
        <div className="flex items-center justify-between">
          <a
            href={`/categories/${property.category.name.toLowerCase()}`}
            className="text-xs px-4 py-1 bg-gray-200 text-gray-700 font-medium uppercase rounded-sm w-1/3 text-center"
          >
            {property.category.name}
          </a>
          <span className="py-3 text-end text-indigo-800 font-medium text-lg w-1/2">
            {property.price} €
          </span>
        </div>
        <a
          href={`/property/${property.id}`}
          className="py-3 text-center text-white font-medium text-lg bg-indigo-800 hover:bg-indigo-600 w-full rounded-sm transition"
        >
          Voir
        </a>
      </div>
    </div>
  );
};
export default Card;

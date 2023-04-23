interface ViewCardProps {
  getData: {
    property?: {
      title: string;
      description: string;
      price: number | null;
      rooms: number | null;
      wc: number | null;
      parking: number | null;
      image: string;
    };
  };
}

const ViewCard = ({ getData }: ViewCardProps) => {
  return (
    <div className="md:w-2/3 bg-white shadow-md">
      <img
        src={`${getData.property?.image}`}
        alt={`Imagen de la Propiedad: ${getData.property?.title}`}
      />
      <div className="px-5 py-6 space-y-4">
        <p className="text-sm lg:text-lg text-gray-600">
          {getData.property?.description}
        </p>
        <h2 className="text-xl lg:text-2xl leading-6 font-medium text-indigo-800">
          Information de la propriété
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="uppercase text-gray-600 font-medium text-xs">
            Chambres
            <span className="text-gray-800 block text-base lg:text-lg">
              {getData.property?.rooms}
            </span>
          </p>
          <p className="uppercase text-gray-600 font-medium text-xs">
            WC
            <span className="text-gray-800 block text-base lg:text-lg">
              {getData.property?.wc}
            </span>
          </p>
          <p className="uppercase text-gray-600 font-medium text-xs">
            Parking
            <span className="text-gray-800 block text-base lg:text-lg">
              {getData.property?.parking}
            </span>
          </p>
          <p className="uppercase text-gray-600 font-medium text-xs">
            Prix
            <span className="text-gray-800 block text-base lg:text-lg">
              {getData.property?.price} €
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ViewCard;

import { formatDate } from "../helpers/formatDate";

interface MessageProps {
  message: {
    id: number | null;
    message: string;
    createdAt: string;
    propertyId: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

const Message = ({ message }: MessageProps) => {
  return (
    <li className="border-gray-300 border-b py-5">
      <p className="font-medium text-gray-500">
        Prénom: <span className="font-normal">{message.user.name}</span>
      </p>
      <p className="font-medium text-gray-500">
        Email: <span className="font-normal">{message.user.email}</span>
      </p>

      <p className="font-medium text-gray-500">
        Message: <span className="font-normal">{message.message}</span>
      </p>

      <p className="font-medium text-gray-500">
        Envoyé le:{" "}
        <span className="font-normal">
          {formatDate(message.createdAt).charAt(0).toUpperCase() +
            formatDate(message.createdAt).slice(1).toLowerCase()}
        </span>
      </p>
    </li>
  );
};
export default Message;

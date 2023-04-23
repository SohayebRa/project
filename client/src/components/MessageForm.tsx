interface MessageFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  getData: {
    msg?: string;
    errors?: { msg: string }[];
    redirect?: string;
    page?: string;
  };
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MessageForm = ({
  handleSubmit,
  getData,
  message,
  setMessage,
}: MessageFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="uppercase text-gray-600 font-medium text-xs"
        >
          Message
        </label>
        {getData.msg && (
          <div className="max-w-md mx-auto my-10">
            <p className="bg-green-100 text-green-600 border border-green-600 text-sm text-center p-2 mb-1">
              {getData.msg}
            </p>
          </div>
        )}
        {getData.errors && (
          <div className="max-w-md mx-auto my-10">
            {getData.errors.map((error) => (
              <p
                key={error.msg}
                className="bg-red-100 text-red-600 border border-red-600 text-sm text-center p-2 mb-1"
              >
                {error.msg}
              </p>
            ))}
          </div>
        )}
        <textarea
          className="w-full p-2 border border-gray-300 shadow-md placeholder-gray-400 resize-none"
          name="message"
          id="message"
          placeholder="Ecrivez votre message ici"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <input
          type="submit"
          value="Envoyer"
          className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium uppercase text-sm w-full py-3 cursor-pointer text-center rounded-sm"
        />
      </div>
    </form>
  );
};
export default MessageForm;

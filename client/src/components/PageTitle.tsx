interface PageTitleProps {
  getData: {
    page: string;
  };
}

const PageTitle = ({ getData }: PageTitleProps) => {
  return (
    <h2 className="text-center text-2xl font-semibold text-indigo-900 py-12 px-6">
      {getData.page}
    </h2>
  );
};
export default PageTitle;

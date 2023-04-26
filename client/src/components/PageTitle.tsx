interface PageTitleProps {
  getData: {
    page: string;
  };
  categoryName?: string;
}

const PageTitle = ({ getData, categoryName }: PageTitleProps) => {
  return (
    <h2 className="text-center text-2xl font-semibold text-indigo-900 py-12 px-6">
      {getData.page}
      {categoryName && ` ${categoryName}`}
    </h2>
  );
};

export default PageTitle;

const formatDate = (date: string): string => {
  const newDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return newDate.toLocaleString("fr-FR", options);
};

export { formatDate };

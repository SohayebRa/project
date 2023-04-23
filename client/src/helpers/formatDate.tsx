const formatDate = (date: string): string => {
  const newDate = new Date(date).toISOString().slice(0, 10);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return new Date(newDate).toLocaleDateString("fr-FR", options);
};

export { formatDate };

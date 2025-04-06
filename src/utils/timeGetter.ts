export const timeGetter = (date: string) => {
  const indexOfFirst = date.indexOf("T");
  const indexOfLast = date.indexOf("+");
  const time = date.substring(indexOfFirst + 1, indexOfLast);
  return time;
};
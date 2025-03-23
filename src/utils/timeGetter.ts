export const timeGetter = (date: string) => {
  console.log(date);
  const indexOfFirst = date.indexOf("T");
  const indexOfLast = date.indexOf("+");
  const time = date.substring(indexOfFirst + 1, indexOfLast);
  console.log(time);
  return time;
};
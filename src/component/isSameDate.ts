export const isSameDate = (start: string, end: string) => {
  const dateArray = [start.substring(0, 10), end.substring(0, 10)];
  if (dateArray[0] === dateArray[1]) {
    return true;
  } else {
    return false;
  }
}
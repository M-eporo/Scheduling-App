export const dateFormatter = (date: string, flag = false, isSameDate = false) => {
  const arg = new Date(date);
  if (isSameDate) {
    arg.setDate(new Date(arg).getDate());
  }else if (flag) {
    arg.setDate(new Date(arg).getDate() - 1);
  }

  const formattedDate = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  }).format(new Date(arg));
  
  const newDate = formattedDate.replace(/(\d+)\/(\d+)\/(\d+)/, "$1年$2月$3日");
  return newDate;
};
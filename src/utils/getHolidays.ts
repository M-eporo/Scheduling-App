export async function fetchHolidays() {
  try {
    const response = await fetch("https://holidays-jp.github.io/api/v1/date.json")
    const holidays = await response.json();
    return Object.entries(holidays).map(([date, holiday]) => {
      const arr = {
        title: holiday as string,
        dates: date,
        // color: "#ff0000",
      };
      return arr;
    });
  } catch (err) {
    console.error(err);
    alert("祝日データの取得に失敗しました");
    return [];
  }
}


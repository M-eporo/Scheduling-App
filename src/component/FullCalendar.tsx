import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullCalendar/daygrid";

const MyFullCalendar = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
    />
  );
}

export default MyFullCalendar;
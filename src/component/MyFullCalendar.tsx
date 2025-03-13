import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullCalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { fetchHolidays } from "../utils/getHolidays";
import { useEffect, useState } from "react";
import Button from "./Button";
import { auth } from "../firebase";

type HolidayType = {
  title: string;
  date: string;
  start?: Date;
  end?: Date;
  startStr?: string;
  endStr?: string;
  allDay?: boolean;
}[];
type ClickEventType = {
  title: string;
  date: string;
  start?: Date;
  end?: Date;
  startStr?: string;
  endStr?: string;
  allDay?: boolean;
}[];
type SelectEventType = {
  title: string;
  date: string;
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
}[];
type AllEventsType = {
  title: string;
  date: string;
  start?: Date;
  end?: Date;
  startStr?: string;
  endStr?: string;
  allDay?: boolean;
}[];

const MyFullCalendar = () => {
  const [allEvents, setAllEvents] = useState<AllEventsType>([]);
  const [holidayEvents, setHolidayEvents] = useState<HolidayType>([]);
  const [clickEvents, setClickEvents] = useState<ClickEventType>([]);
  const [selectEvents, setSelectEvents] = useState<SelectEventType>([]);
  useEffect(() => {
    const getHolidays = async () => {
      const holidays = await fetchHolidays();
      setHolidayEvents(holidays);
    };
    getHolidays();
  }, []);

  useEffect(() => {
    setAllEvents([
      ...holidayEvents,
      ...clickEvents,
      ...selectEvents
    ]);
  }, [holidayEvents, clickEvents, selectEvents]);

  const getDayClassName = (date: Date) => {
    const day: number = date.getDay();
    const formattedDate = date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).replace(/\//g, "-");
    const isHoliday = holidayEvents.some(holiday => holiday.date === formattedDate);
    const classNames: string[] = [];
    if (day === 0 || isHoliday) classNames.push("holiday");
    if (day === 6) classNames.push("saturday");
    return classNames;
  };
  const handleClick = (info: DateClickArg) => {
    console.log(info);
    const title = prompt("イベントタイトルを入力してください");
    if (title) {
      setClickEvents([
        ...clickEvents,
        {
          title: title,
          date: info.dateStr,
        }
      ]);
    }
  };

  const handleSelect = (info) => {
    const title = prompt("イベントタイトルを入力してください");
    if (title) {
      setSelectEvents([
        ...selectEvents,
        {
          title: title,
          date: info.startStr,
          start: info.start,
          end: info.end,
          startStr: info.startStr,
          endStr: info.endStr,
          allDay: info.allDay,
        }
      ]);
    }
  }; 
  
  return (
    <div style={{position: "relative"}}>
      <FullCalendar
        locale="jaLocale"
        headerToolbar={{
          left: "prevYear, prev, today, next, nextYear",
          center: "title",
          right: "timeGridDay, timeGridWeek, dayGridMonth, multiMonthYear",
        }}
        buttonText={{
          today: "今日",
          day: "日",
          week: "週",
          month: "月",
          year: "年"
        }}
        plugins={[
          timeGridPlugin,
          dayGridPlugin,
          listPlugin,
          multiMonthPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        selectable={true}
        unselectAuto={true}
        dayCellClassNames={(info) => getDayClassName(info.date)}
        events={allEvents}
        dateClick={handleClick}
        select={handleSelect}
      />
      <Button
        styleName="logout"
        type="button"
        disabled={false}
        signOut={async () => {
          const isConfirmed = confirm("ログアウトしますか?");
          if (isConfirmed) {
            await auth.signOut();
          }
        }}
        value="ログアウト"
      />
    </div>
  );
};

export default MyFullCalendar;
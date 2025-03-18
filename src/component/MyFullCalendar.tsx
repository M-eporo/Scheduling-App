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
import EmailVerifying from "./EmailVerifying";
import type {
  HolidayType,
  ClickEventType,
  SelectEventType,
  AllEventsType
} from "../types";
import { useAppSelector } from "../app/hooks";

const MyFullCalendar = () => {
  const [allEvents, setAllEvents] = useState<AllEventsType>([]);
  const [holidayEvents, setHolidayEvents] = useState<HolidayType>([]);
  const [clickEvents, setClickEvents] = useState<ClickEventType>([]);
  const [selectEvents, setSelectEvents] = useState<SelectEventType>([]);

  const user = useAppSelector((state) => state.user.user);
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
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
    <>
      {user?.emailVerified || emailUser?.emailVerified ? (
        <div style={{ position: "relative" }}>
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
      ) : (
        <EmailVerifying />
      )}
    </>
  );
};

export default MyFullCalendar;
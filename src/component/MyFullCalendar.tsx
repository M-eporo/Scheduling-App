import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullCalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateSelectArg, EventClickArg, EventHoveringArg } from "@fullcalendar/core";
import { fetchHolidays } from "../utils/getHolidays";
import { useEffect, useState } from "react";
import Button from "./Button";
import { auth } from "../firebase";
import EmailVerifying from "./EmailVerifying";
import type {
  AllEventType,
  EventType,
  InitialEventType
} from "../types";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useAddSchedules } from "../utils/useAddSchedule";
import { getUserSchedules } from "../utils/getUserSchedules";
import { setSchedulesReducer } from "../features/scheduleSlice";
import Modal from "./Modal";
import { EventImpl } from "@fullcalendar/core/internal";

const MyFullCalendar = () => {
  const [allEvents, setAllEvents] = useState<AllEventType>([]);
  const [holidayEvents, setHolidayEvents] = useState<InitialEventType>([]);
  const [storedSchedules, setStoredSchedules] = useState<InitialEventType>([]);
  const [clickEvents, setClickEvents] = useState<EventType>([]);
  const [selectEvents, setSelectEvents] = useState<EventType>([]);
  const [initialEvents, setInitialEvents] = useState<InitialEventType>([]);

  //Modalの表示
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<EventImpl>();
  const user = useAppSelector((state) => state.user.user);
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
  const addSchedule = useAddSchedules();
  const dispatch = useAppDispatch();
  //初回レンダリング時
  useEffect(() => {
    //祝日のデータを取得
    const getHolidays = async () => {
      const holidays = await fetchHolidays();
      setHolidayEvents(holidays);
    }
    getHolidays();
  }, []);

  //Firestoreに保存されているスケジュールデータを取得
  useEffect(() => {
    if (auth.currentUser) {
      const getStoredSchedules = async () => {
        const storedSchedules = await getUserSchedules();
        if (storedSchedules) {
          setStoredSchedules(storedSchedules);
        }
      };
      getStoredSchedules();
    }
  }, [auth.currentUser]);

  //初期イベント情報の設定
  //祝日とFirestoreに保存されてデータ
  //InitialEventsの設定に使用
  useEffect(() => {
    setInitialEvents([
      ...holidayEvents,
      ...storedSchedules
    ]);
  }, [holidayEvents, storedSchedules]);

  //全てのイベントをセット
  useEffect(() => {
    setAllEvents([
      ...initialEvents,
      ...clickEvents,
      ...selectEvents
    ]);
  }, [initialEvents, clickEvents, selectEvents]);

  //全てのイベントが取得出来たら、Reduxを更新
  useEffect(() => {
    dispatch(setSchedulesReducer(allEvents))
  }, [allEvents, dispatch]);

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
    info.jsEvent.preventDefault();
    console.log(info);
    const title = prompt("イベントタイトルを入力してください");
    if (title) {
      setClickEvents([
        ...clickEvents,
        {
          title,
          allDay: info.allDay,
          createdAt: new Date().toISOString(),
          date: info.date.toISOString(),
          dateStr: info.dateStr,
        }
      ]);

      //Firestoreに新規イベントを保存(一日)
      addSchedule({
        title,
        allDay: info.allDay,
        createdAt: new Date().toISOString(),
        date: info.date.toISOString(),
        dateStr: info.dateStr,
      });
    }
  };

  const handleSelect = (info: DateSelectArg) => {
    const title = prompt("イベントタイトルを入力してください(セレクト)");
    console.log(info);
    if (title) {
      setSelectEvents([
        ...selectEvents,
        {
          title,
          allDay: info.allDay,
          createdAt: new Date().toISOString(),
          start: info.start.toISOString(),
          end: info.end.toISOString(),
          startStr: info.startStr,
          endStr: info.endStr,
        }
      ]);

      //Firestoreに新規イベントを保存(複数日)
      addSchedule({
        title,
        allDay: info.allDay,
        createdAt: new Date().toISOString(),
        start: info.start.toISOString(),
        end: info.end.toISOString(),
        startStr: info.startStr,
        endStr: info.endStr,
      });
    }
  }; 

  const handleEventClick = (info: EventClickArg) => {
    setIsShowModal((prevState) => !prevState);
    console.log(info.event);
    setModalData(info.event);
    
    console.log(info.event.title)
    console.log(info.event.allDay)
    console.log(info.event._def.extendedProps.createdAt);
    console.log(info.event._def.extendedProps.dateStr);
    console.log(info.event.end);
    console.log(info.event.endStr);
    console.log(info.event.start);
    console.log(info.event.startStr);

  };

  const handleMouseEnter = (info: EventHoveringArg) => {
    console.log(info);
  };
  const handleMouseLeave = (info: EventHoveringArg) => {
    console.log(info);
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
            selectMinDistance={1}
            dayCellClassNames={(info) => getDayClassName(info.date)}
            events={allEvents}
            dateClick={handleClick}
            select={handleSelect}
            eventClick={handleEventClick}
            eventMouseEnter={handleMouseEnter}
            eventMouseLeave={handleMouseLeave}
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
          {isShowModal && modalData && <Modal event={modalData} />}
          
        </div>
      ) : (
        <EmailVerifying />
      )}
    </>
  );
};

export default MyFullCalendar;
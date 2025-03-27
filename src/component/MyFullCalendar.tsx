import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullCalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateSelectArg, EventClickArg, EventHoveringArg } from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";

import { useEffect, useState } from "react";

import { auth } from "../firebase";

import { v4 as uuidv4 } from "uuid";

import Button from "./Button";
import EmailVerifying from "./EmailVerifying";
import Modal from "./Modal";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchHolidays } from "../utils/getHolidays";
import { useAddSchedules } from "../utils/useAddSchedule";
import { getUserSchedules } from "../utils/getUserSchedules";
import { setSchedulesReducer } from "../features/scheduleSlice";

import type {
  AllEventType,
  EventType,
  InitialEventType
} from "../types";

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
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

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
      const id = uuidv4();
      setClickEvents([
        ...clickEvents,
        {
          id,
          title,
          allDay: info.allDay,
          createdAt: new Date().toISOString(),
          date: info.date.toISOString(),
          dateStr: info.dateStr,
        }
      ]);

      //Firestoreに新規イベントを保存(一日)
      addSchedule({
        id,
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
      const id = uuidv4();
      setSelectEvents([
        ...selectEvents,
        {
          id,
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
        id,
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
    
  };
  const handleMouseEnter = (info: EventHoveringArg) => {
    if (info.view.type === "timeGridDay" || info.view.type === "multiMonthYear") return;
  
    const rect = info.el.getBoundingClientRect()
    setIsShowModal(true);
    //setTop(rect.top + pageYOffset)
    if (rect.left > window.innerWidth / 2) {
      setLeft(info.el.getBoundingClientRect().left);
    } else if (rect.left < window.innerWidth / 2) {
      setLeft(rect.left + info.el.clientWidth);
    }
    if (rect.top > window.innerHeight / 2) {
      setTop((rect.top + pageYOffset) - rect.height * 2);
    } else if (rect.top < window.innerHeight / 2) {
      setTop(rect.bottom + pageYOffset);
    }
    setModalData(info.event);
  };
  const handleMouseLeave = () => {
    setIsShowModal(false);
  };
  //view.type
  //日：timeGridDay
  //週：timeGridWeek
  //月：dayGridMonth
  //年：multiMonthYear
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
            height="100vh"
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
            dayMaxEventRows={3}
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
          {isShowModal && modalData &&
            <Modal
              style={{
                top: top,
                left: left,
              }}
              event={modalData}
            />
          }
        </div>
      ) : (
        <EmailVerifying />
      )}
    </>
  );
};

export default MyFullCalendar;
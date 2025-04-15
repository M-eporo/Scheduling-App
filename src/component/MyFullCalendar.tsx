import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullCalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateSelectArg, EventClickArg, EventMountArg } from "@fullcalendar/core";
import { useEffect, useState } from "react";
import {Tooltip as ReactTooltip} from "react-tooltip";
import { auth } from "../firebase";
import Button from "./Button";
import EmailVerifying from "./EmailVerifying";
import SchedulesModal from "./SchedulesModal";
import ScheduleRegister from "./ScheduleRegister";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchHolidays } from "../utils/getHolidays";
import { timeGetter } from "../utils/timeGetter";
import { createTooltipHtml } from "../utils/createTooltipHtml";
import { useGetUserSchedules } from "../hooks/useGetUserSchedules";
import { setSchedulesReducer } from "../features/scheduleSlice";

import type {
  AllEventType,
  EventType,
  InitialEventType
} from "../types";

const MyFullCalendar = () => {
  const [events, setEvents] = useState<AllEventType>([]);
  const [holidayEvents, setHolidayEvents] = useState<InitialEventType>([]);
  const [storedSchedules, setStoredSchedules] = useState<InitialEventType>([]);

  //Modalの表示
  const [isSchedulesModalShow, setIsSchedulesModalShow] = useState(false);
  const [schedulesModalData, setSchedulesModalData] = useState<EventType>([]);

  //ScheduleRegisterの表示
  const [isSchedulesRegisterShow, setIsSchedulesRegisterShow] = useState(false);
  const [clickData, setClickData] = useState({
    allDay: true,
    date: new Date(),
    dateStr: "",
  });

  const user = useAppSelector((state) => state.user.user);
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
  const schedules = useAppSelector((state) => state.schedules.schedules);
  const dispatch = useAppDispatch();

  //初回レンダリング時
  useEffect(() => {
    //祝日のデータを取得
    const getHolidays = async () => {
      const holidays = await fetchHolidays();
      setHolidayEvents(holidays);
    };
    getHolidays();
    
  }, []);
  //Firestoreに保存されているスケジュールデータを取得
  //onSnapShotによる自動更新
  const userSchedules = useGetUserSchedules();
  useEffect(() => {
    setStoredSchedules(userSchedules);
  }, [userSchedules]);
  // useEffect(() => {
  //   if (auth.currentUser) {
  //     const getStoredSchedules = async () => {
  //       const storedSchedules = await getUserSchedules();
  //       if (storedSchedules) {
  //         setStoredSchedules(storedSchedules);
  //       }
  //     };
  //     getStoredSchedules();
  //   }
  // }, []);
  
  //初期イベント情報の設定
  //祝日とFirestoreに保存されてデータ
  //InitialEventsの設定に使用
  // useEffect(() => {
  //   setInitialEvents([
  //     ...holidayEvents,
  //     ...storedSchedules
  //   ]);
  // }, [holidayEvents, storedSchedules]);
  // //全てのイベントをセット
  // useEffect(() => {
  //   setAllEvents([
  //     ...initialEvents,
  //     ...clickEvents,
  //     ...selectEvents
  //   ]);
  // }, [initialEvents, clickEvents, selectEvents]);
  useEffect(() => {
    setEvents([
      ...holidayEvents,
      ...storedSchedules
    ]);
  }, [holidayEvents, storedSchedules]);
  //全てのイベントが取得出来たら、Reduxを更新
  useEffect(() => {
    dispatch(setSchedulesReducer(events));
  }, [events, dispatch]);

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
    setIsSchedulesRegisterShow(true);
    setClickData({
      allDay: info.allDay,
      date: info.date,
      dateStr: info.dateStr
    });
    console.log(info);
  };

  const handleSelect = (info: DateSelectArg) => {
    setIsSchedulesRegisterShow(true);
    
    console.log(info);
  }; 

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    //clickしてスケジュールの変更、削除
    if (auth.currentUser) {
      const data = schedules.filter(schedule => schedule.id === info.event.id);
      setSchedulesModalData(data);
      setIsSchedulesModalShow(true);
    }
  };
  //React Tooltip Popup
  const handleEventDidMount = (info: EventMountArg) => {
    const title = info.event.title;
    const isAllDay = info.event.allDay ? "(終日)" : "";
    const start = timeGetter(info.event.startStr) ? timeGetter(info.event.startStr) : "";
    const end = timeGetter(info.event.endStr) ? timeGetter(info.event.endStr) : "";
    const color = info.event.extendedProps.backgroundColor;
    const border = info.event.extendedProps.borderColor;
    const safeHtml = createTooltipHtml({
      title,
      isAllDay,
      start,
      end,
      color,
      border
    });
    info.el.style.backgroundColor = color;
    info.el.style.borderColor = border;
    info.el.setAttribute('data-tooltip-id', 'event-tooltip');
    info.el.setAttribute('data-tooltip-html', safeHtml);
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
            events={events}
            dateClick={handleClick}
            select={handleSelect}
            eventClick={handleEventClick}
            eventDidMount={handleEventDidMount}
            
          />
          <ReactTooltip
            id="event-tooltip"
            place="top"
            render={({content }) => (
              <div dangerouslySetInnerHTML={{__html: content ?? ""}}></div>  
            )}
            style={{
              boxSizing: "border-box",
              fontSize: "12px",
              fontWeight: "semi-bold",
              backgroundColor: "#3BC22F",
              color: "#fff",
              filter: "brightness(1.2)",
              zIndex: 999,
              boxShadow: "0 0 5px 2px rgba(0,0,0,0.2)"
            }}
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
          {isSchedulesModalShow &&
            <SchedulesModal
              setIsSchedulesModalShow={setIsSchedulesModalShow}
              data={schedulesModalData}
            />
          }
          {isSchedulesRegisterShow && 
            <ScheduleRegister
              setIsShow={setIsSchedulesRegisterShow}
              data={clickData}
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
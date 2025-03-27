import styles from "../styles/modal.module.css";
import { EventImpl } from '@fullcalendar/core/internal';
import { useAppSelector } from '../app/hooks';
import { dateFormatter } from "../utils/dateFormatter";
import { timeGetter } from "../utils/timeGetter";
import { isSameDate } from "./isSameDate";
import React from "react";

type ModalProps = {
  event: EventImpl,
  style: React.CSSProperties
}

const Modal = ({ event, style }: ModalProps ) => {
  const schedules = useAppSelector((state) => state.schedules.schedules);
  
  const dataMap = schedules.filter(schedule => {
    if (!event.end) {
      return schedule.dateStr === event.startStr;
    } else {
      return schedule.endStr === event._def.extendedProps.endStr;
    }
  })
  return (
    <>
      {dataMap.map((data) => (
        <div style={style} className={styles.container} key={data.id}>
            <h3 className={styles.scheduleTitle}>{data.title}</h3>
            <div className={styles.textContainer}>
              {data.date 
              ?
                <p>{dateFormatter(data.date)}</p>
              :
                <>
                  {data.start && data.end && isSameDate(data.start, data.end)
                  ?
                    <>
                      {data.allDay && <p>終日</p>}
                      <p>開始日{data.start && dateFormatter(data.start)}</p>
                      <p>終了日{data.end && dateFormatter(data.end, false, true)}</p>
                    </>
                  :
                    <>
                      <p>開始日{data.start && dateFormatter(data.start)}</p>
                      <p>終了日{data.end && dateFormatter(data.end, true)}</p>
                    </>
                  }
                </>
              }
              {data.allDay
              ?
                <p className={styles.allDay}>終日</p>
              :
                <>
                  {data.dateStr
                  ?
                    <p className={styles.startTimeNoEnd}>{timeGetter(data.dateStr)}</p>
                  :
                    <>
                      {data.start === data.end
                      ?
                        <p className={styles.startTime}>開始{data.startStr && timeGetter(data.startStr)}</p>
                      :
                        <>
                          <p className={styles.startTime}>開始{data.startStr && timeGetter(data.startStr)}</p>
                          <p className={styles.endTime}>終了{data.endStr && timeGetter(data.endStr)}</p>
                        </>
                      }
                    </>
                  }
                </>
              } {/* 時間を入れる。endStrとstartStrをから取り出す*/}            
              
            </div>
            {/* <p>{data.dateStr}</p> 日付のみ、日ビューの時は + 時間(2025-03-23T07:00:00+09:00") ここにしか時間のデータはない */}
        </div>
      ))}
    </>
  )
}

export default Modal;
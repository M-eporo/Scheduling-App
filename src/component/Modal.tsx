import styles from "../styles/modal.module.css";
import { EventImpl } from '@fullcalendar/core/internal';
import { useAppSelector } from '../app/hooks';
import { dateFormatter } from "../utils/dateFormatter";
import { timeGetter } from "../utils/timeGetter";

type ModalProps = {
  event: EventImpl
}

const Modal = ({ event }: ModalProps ) => {
  const schedules = useAppSelector((state) => state.schedules.schedules);
  console.log(schedules);
  //一日=
  console.log(event);
  
  const dataMap = schedules.filter(schedule => {
    if (!event.end) {
      return schedule.dateStr === event.startStr;
    } else {
      return schedule.endStr === event._def.extendedProps.endStr;
    }
  })
  console.log(dataMap);
  return (
    <div>
      {dataMap.map((data) => (
        <>
          <div className={styles.oneday} key={data.date}>
            <h3>{data.title}</h3>
            {data.allDay ?
                <p>終日</p>
              :
              <>
                <p>{data.startStr && timeGetter(data.startStr)}</p>
                <p>{data.endStr && timeGetter(data.endStr)}</p>
              </>
            } {/* 時間を入れる。endStrとstartStrをから取り出す*/}
            
            {data.date
              ?
              <p>{dateFormatter(data.date)}</p>
              :
              <>
                <p>{data.start && dateFormatter(data.start)}</p>
                <p>{data.end && dateFormatter(data.end, true)}</p>
              </>
            }  {/* 日付+時間 */}
            <p>{data.dateStr}</p> {/* 日付のみ、日ビューの時は + 時間(2025-03-23T07:00:00+09:00") ここにしか時間のデータはない*/}
          </div>
          {/* <div className={styles.days} key={data.startStr}> */}
            {/* <h3>{data.title}</h3> */}
            {/* <p>{data.allDay}</p> */}
            {/* <p>{data.start}</p> 日付+時間 */}
            {/* <p>{data.startStr}</p>  日付のみ、日ビューの時は + 時間(2025-03-23T07:00:00+09:00") ここにしか時間のデータはない */}
            {/* <p>{data.end}</p> 日付+時間 */}
            {/* <p>{data.endStr}</p>  日付のみ、日ビューの時は + 時間(2025-03-23T07:00:00+09:00") ここにしか時間のデータはない */}
          {/* </div> */}
        </>
      ))}
      
    </div>
  )
}

export default Modal;
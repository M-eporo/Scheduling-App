import styles from "../styles/listView.module.css";
import FullCalendar from "@fullcalendar/react";
import listPlugin from '@fullcalendar/list';
import { AllEventType } from "../types";

type Props = {
  events: AllEventType;
};

const ListView = ({events}: Props) => {
  return (
    <div className={styles.container}>
      <FullCalendar
        locale="jaLocale"
        height="auto"
        plugins={[
          listPlugin,
        ]}
        headerToolbar={{
          left: "",
          center: "listDay,listWeek,listMonth",
          right: "",
        }}
        initialView="listWeek"
        buttonText={{
          listDay: "日",
          listWeek: "週",
          listMonth: "月"
        }}
        events={events}
      />
    </div>
  );
};

export default ListView;
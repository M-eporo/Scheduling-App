import { Timestamp } from "firebase/firestore";

export interface InitialUserState {
  user: null | {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
  }
};
export interface InitialEmailUserState {
  emailUser: null | {
    uid: string;
    name: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
  }
};
export type InitialSchedulesStateType = {
  schedules: ScheduleType[];
};

export type ScheduleType = {
  id?: string;
  title: string;
  allDay: boolean;
  createdAt?: Date | Timestamp | string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  extendedProps: {
    backgroundColor: string;
    borderColor: string;
    desc?: string;
  }
};

export type InitialEventType = {
  id?: string;
  title: string;
  date?: string;
  allDay?: boolean;
  createdAt?: Date | Timestamp | string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  extendedProps?: {
    backgroundColor: string;
    borderColor: string;
    desc?: string;
  }
}[];
export type HolidayType = {
  id?: string;
  title: string;
  date: string;
  extendedProps?: {
    backgroundColor: string;
    borderColor: string;
    desc?: string;
  }
}[];

export type EventType = {
  id?: string;
  title: string;
  allDay?: boolean;
  createdAt?: Date | Timestamp | string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  extendedProps: {
    backgroundColor: string;
    borderColor: string;
    desc?: string;
  }
}[];

export type EventObjType = {
  id?: string;
  title: string;
  allDay?: boolean;
  createdAt?: Date | Timestamp | string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  extendedProps: {
    backgroundColor: string;
    borderColor: string;
    desc?: string;
  }
};

export type AllEventType = {
  id?: string;
  title: string;
  date?: string;
  allDay?: boolean;
  createdAt?: Date | Timestamp | string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  extendedProps?: {
    backgroundColor: string;
    borderColor: string;
    desc?: string;
  }
}[];

export type ColorOptionType = {
  value: string;
  label: string;
  style: string;
};
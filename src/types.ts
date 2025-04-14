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
  desc?: string;
  allDay: boolean;
  createdAt: string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  bgColor: string;
  borderColor: string;
};

export type InitialEventType = {
  id?: string;
  title: string;
  desc?: string;
  date?: string;
  allDay?: boolean;
  createdAt?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  bgColor?: string;
  borderColor?: string;
}[];
export type HolidayType = {
  id?: string;
  title: string;
  date: string;
  desc?: string;
  bgColor?: string;
  borderColor?: string;
}[];

export type EventType = {
  id?: string;
  title: string;
  desc?: string;
  allDay?: boolean;
  createdAt?: string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  bgColor: string;
  borderColor: string;
}[];

export type EventObjType = {
  id?: string;
  title: string;
  desc?: string;
  allDay?: boolean;
  createdAt: string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  bgColor: string;
  borderColor: string;
};

export type AllEventType = {
  id?: string;
  title: string;
  desc?: string;
  date?: string;
  allDay?: boolean;
  createdAt?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
  bgColor?: string;
  borderColor?: string;
}[];

export type ColorOptionType = {
  value: string;
  label: string;
  style: string;
};
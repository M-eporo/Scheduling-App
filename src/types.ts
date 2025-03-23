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
  title: string;
  allDay: boolean;
  createdAt: string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
};


export type InitialEventType = {
  title: string;
  date?: string;
  allDay?: boolean;
  createdAt?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
}[];
export type HolidayType = {
  title: string;
  date: string;
}[];

export type EventType = {
  title: string;
  allDay?: boolean;
  createdAt?: string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
}[];

export type EventObjType = {
  title: string;
  allDay?: boolean;
  createdAt: string;
  date?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
};

export type AllEventType = {
  title: string;
  date?: string;
  allDay?: boolean;
  createdAt?: string;
  dateStr?: string;
  start?: string;
  end?: string;
  startStr?: string;
  endStr?: string;
}[];
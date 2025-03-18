export interface InitialUserState {
  user: null | {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
  }
}

export interface InitialEmailUserState {
  emailUser: null | {
    uid: string;
    name: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
  } 
}

export type HolidayType = {
  title: string;
  date: string;
  start?: Date;
  end?: Date;
  startStr?: string;
  endStr?: string;
  allDay?: boolean;
}[];

export type ClickEventType = {
  title: string;
  date: string;
  start?: Date;
  end?: Date;
  startStr?: string;
  endStr?: string;
  allDay?: boolean;
}[];

export type SelectEventType = {
  title: string;
  date: string;
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
}[];

export type AllEventsType = {
  title: string;
  date: string;
  start?: Date;
  end?: Date;
  startStr?: string;
  endStr?: string;
  allDay?: boolean;
}[];
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CalendarViewDayOutlinedIcon from '@mui/icons-material/CalendarViewDayOutlined';
import CalendarViewWeekOutlinedIcon from '@mui/icons-material/CalendarViewWeekOutlined';
import CalendarViewMonthOutlinedIcon from '@mui/icons-material/CalendarViewMonthOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { auth } from '../firebase';

export const drawerMenu = ((handleChangeView: (view: string) => void) => [
  { title: "ユーザー情報", icon: ManageAccountsOutlinedIcon, },
  { title: "ログアウト", icon: LogoutOutlinedIcon, onClick: () => auth.signOut() },
  { title: "day", icon: CalendarViewDayOutlinedIcon, onClick: () => handleChangeView("timeGridDay")},
  { title: "week", icon: CalendarViewWeekOutlinedIcon, onClick: () => handleChangeView("timeGridWeek") },
  { title: "month", icon: CalendarViewMonthOutlinedIcon, onClick: () => handleChangeView("dayGridMonth") },
  { title: "year", icon: CalendarMonthOutlinedIcon, onClick: () => handleChangeView("multiMonthYear") }
]);
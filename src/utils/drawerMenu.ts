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
  { title: "日", icon: CalendarViewDayOutlinedIcon, onClick: () => handleChangeView("timeGridDay")},
  { title: "週", icon: CalendarViewWeekOutlinedIcon, onClick: () => handleChangeView("timeGridWeek") },
  { title: "月", icon: CalendarViewMonthOutlinedIcon, onClick: () => handleChangeView("dayGridMonth") },
  { title: "年", icon: CalendarMonthOutlinedIcon, onClick: () => handleChangeView("multiMonthYear") }
]);
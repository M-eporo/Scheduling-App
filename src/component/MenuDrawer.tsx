import styles from "../styles/menuDrawer.module.css";
import { useState } from "react";
import Divider from '@mui/material/Divider';
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { drawerMenu } from "../utils/drawerMenu";
import { useAppSelector } from "../app/hooks";
import UserIcon from "./UserIcon";
import UserInfoModal from "./UserInfoModal";
import { AllEventType, UserType } from "../types";
import { green } from "@mui/material/colors";
import ListView from "./ListView";

type Props = {
  handleChangeView: (view: string) => void;
  events: AllEventType
};

const MenuDrawer = ({handleChangeView, events}: Props) => {
  const [show, setShow] = useState(false);
  const toggleDraw = () => setShow(!show);
  const googleUser = useAppSelector((state) => state.user.user);
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
  const user: UserType = googleUser ? googleUser : emailUser;
  const menu = drawerMenu(handleChangeView);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  return (
    <>
      <IconButton
        className={styles.btn}
        onClick={toggleDraw}
        sx={isMobile ? {
          display: "revert",
          position: "absolute",
          bottom: "5%",
          right: "5%",
          zIndex: 999,
          opacity: 0.8,
        } : {
          display: "none"
        }}
      >
        <SettingsOutlinedIcon
          className={styles.setting}
          sx={{ color: green[700], fontSize: 40 }}
        />
      </IconButton>
      <Drawer
        anchor="left"
        variant={isMobile ? "temporary" : "permanent"}
        open={show}
        onClose={toggleDraw}
      >
        <Box sx={{ height: "100vh" }} >
          <List>
            <div className={styles.logoContainer}>
            {emailUser
              ? 
              <UserIcon userName={emailUser.displayName} />
              :
              <img className={styles.userPhoto} src={googleUser?.photo} alt="ユーザーアイコン" />
            }
            </div>
            <Divider />
            {menu.map((obj) => {
              const Icon = obj.icon;
              return (
                <ListItem
                  key={obj.title}
                  sx={
                    (obj.title !== "ユーザー情報" && obj.title !== "ログアウト" && !isMobile)
                      ? { display: "none" }
                      : {}
                  }
                >
                  {obj.title === "ユーザー情報"
                    ? 
                    <>
                      <ListItemIcon><Icon /></ListItemIcon>
                        <ListItemText primary={obj.title} />
                      <UserInfoModal user={user} />
                    </>
                    :
                    <ListItemButton onClick={obj.onClick}>
                      <ListItemIcon><Icon /></ListItemIcon>
                      <ListItemText primary={obj.title} />
                      </ListItemButton>
                    
                 }          
                </ListItem>
              );
            })}
            {!isMobile && <ListView events={events} />}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MenuDrawer;
import styles from "../styles/menuDrawer.module.css";
import { useState } from "react";
import Divider from '@mui/material/Divider';
import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { drawerMenu } from "../utils/drawerMenu";
import { useAppSelector } from "../app/hooks";
import UserIcon from "./UserIcon";
import UserInfoModal from "./UserInfoModal";
import { UserType } from "../types";

type Props = {
  handleChangeView: (view: string) => void;
};

const MenuDrawer = ({handleChangeView}: Props) => {
  const [show, setShow] = useState(false);
  const toggleDraw = () => setShow(!show);
  const googleUser = useAppSelector((state) => state.user.user);
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
  const user: UserType = googleUser ? googleUser : emailUser;
  const menu = drawerMenu(handleChangeView)
  
  return (
    <div className={styles.container}>
      <Button onClick={toggleDraw}><SettingsOutlinedIcon /></Button>
      <Drawer anchor="left" open={show} onClose={toggleDraw}>
        <Box sx={{ height: "100vh" }} >
          <List>
            <div className={styles.logoContainer}>
            {emailUser
              ? 
              <UserIcon userName={emailUser.displayName} />
              :
              <img src={googleUser?.photo} alt="ユーザーアイコン" />
            }
            </div>
            <Divider />
            {menu.map((obj) => {
              const Icon = obj.icon;
              return (
                <ListItem key={obj.title}>
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
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
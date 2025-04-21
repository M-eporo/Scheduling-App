import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";

const UserInfoModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
      >
        <Box>
          <Typography id="modal-title" variant="h4" component="h4">
            ユーザー情報
          </Typography>
          <TextField
            id="uid"
            label="ユーザーID"
            defaultValue={ }
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
            helperText="Read Only"
          />
          <TextField
            id="name"
            label="お名前"
            defaultValue={}
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
            helperText="Read Only"
          />
          <TextField
            id="display-name"
            label="表示名"
            defaultValue={}
          />
          <TextField
            id="e-mail"
            label="メールアドレス"
            defaultValue={ }
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
            helperText="Read Only"
          />
        </Box>


      </Modal>
    </div>
  )
}

export default UserInfoModal;
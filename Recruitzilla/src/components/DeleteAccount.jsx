import { useState } from 'react';
import { Grid, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { supabase } from '../supabaseClient';
import { useAuth } from './context/AuthContext';
import { toast } from 'react-toastify';


const notification = (message, type) => {
  type ? toast[type](message) : toast(message);
};

const CustomButton = ({ value, onClick, type }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
      >
        {value}
      </button>
    )
  }

const DeleteAccount = () => {
  const { session, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = async () => {
    const user = session?.user;

    if (!user) {
      notification("No user is logged in", "error");
      return;
    }

    const { error } = await supabase
      .from("new_users")
      .delete()
      .eq("id", user.id);

    if (error) {
      notification(error.message, "error");
    } else {
      notification("User account deleted successfully", "success");
      await logout();
    }

    handleClose();
  };

  return (
    <Grid item xs={12} style={{ marginTop: '20px' }}>
      <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        Delete Account
      </Typography>
      <CustomButton value="Delete Account" onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Are you sure you want to delete your account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible and your account will be deleted forever
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteUser} color="secondary" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default DeleteAccount;

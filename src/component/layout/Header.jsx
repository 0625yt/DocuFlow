import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

const Header = ({ onLogout, onUserInfo }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleUserInfo = () => { handleClose(); onUserInfo(); };
  const handleLogout = () => { handleClose(); onLogout(); };

  return (
    <AppBar position="fixed" sx={{ background: '#1976d2', boxShadow: 2, zIndex: 3000 }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ fontWeight: 700, letterSpacing: 1 }}>
          DocuFlow
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ position: 'relative', mr: 2, width: 260 }}>
          <Box sx={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', pl: 1 }}>
            <SearchIcon sx={{ color: '#90caf9' }} />
          </Box>
          <InputBase
            placeholder="문서/폴더 검색"
            sx={{
              color: 'inherit',
              background: '#e3f2fd',
              borderRadius: 2,
              pl: 5,
              pr: 2,
              width: '100%',
              fontSize: 15,
              height: 38,
              boxShadow: 1,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <NotificationsIcon />
        </IconButton>
        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
          <Avatar sx={{ bgcolor: '#1565c0', width: 36, height: 36 }}>U</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleUserInfo}>회원정보</MenuItem>
          <MenuItem onClick={handleLogout}><LogoutIcon fontSize="small" sx={{ mr: 1 }} />로그아웃</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
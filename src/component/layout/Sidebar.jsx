import React from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Sidebar = ({ folders, selectedFolderId, onSelect, onAddFolder, onDeleteFolder }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 220,
          boxSizing: 'border-box',
          top: 56,
          height: 'calc(100vh - 56px)',
          background: '#f5f6fa',
          borderRight: '1px solid #dfe6e9',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, borderBottom: '1px solid #dfe6e9' }}>
        <Typography variant="subtitle1" fontWeight={700}>폴더</Typography>
        <IconButton color="primary" size="small" onClick={onAddFolder}>
          <AddIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 0 }}>
        {folders.map(folder => (
          <ListItem key={folder.id} disablePadding secondaryAction={
            <IconButton edge="end" aria-label="delete" size="small" onClick={e => { e.stopPropagation(); onDeleteFolder(folder.id); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          }>
            <ListItemButton
              selected={folder.id === selectedFolderId}
              onClick={() => onSelect(folder.id, folder.folderName)}
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              <ListItemIcon>
                <FolderIcon color={folder.id === selectedFolderId ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary={folder.folderName} primaryTypographyProps={{ fontWeight: folder.id === selectedFolderId ? 700 : 400 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 
import {AppBar, Box, Drawer, IconButton, List, ListItem, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import React, {useState} from "react";
import {AccountCircle} from "@material-ui/icons";
import {getFirebase} from "../lib/firebaseConfig";
import {setAuthUser} from "../lib/auth";
import {logins} from "../provider/login";

export default function AppContainer({ title, login, menuItems = [], profileMenuItems = [], children }) {

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  function openProfileMenu(event) {
    setProfileAnchor(event.currentTarget);
  }

  function closeProfileMenu() {
    setProfileAnchor(null);
  }

  function handleLogout() {
    getFirebase()?.auth().signOut().then(() => {
      setAuthUser(null);
      setUser(null);
    });
  }

  if (!user && login) {
    const Component = logins[login];
    if (Component) {
      return <Component onLogin={user => setUser(user)}/>
    }
  }

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position={"static"}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {user && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={openProfileMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={profileAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(profileAnchor)}
                  onClose={closeProfileMenu}
                >
                  {profileMenuItems.map(item => {
                    return (
                      <MenuItem onClick={item.onClick}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
          <Box sx={{ width: 250 }}>
            <List>
              {menuItems.map((item, i) => {
                return (
                  <ListItem button key={'menuItem' + i} onClick={() => setMenuOpen(false)}>
                    {item}
                  </ListItem>
                )
              })}
            </List>
          </Box>
        </Drawer>
      </Box>
      <Box mt={1}>
        {children}
      </Box>
    </Box>
  )
}

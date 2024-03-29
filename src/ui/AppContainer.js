import {AppBar, Box, Drawer, IconButton, List, ListItem, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import React, {useEffect, useState} from "react";
import {AccountCircle} from "@material-ui/icons";
import {getConfiguration} from "../lib/configuration";
import {setAuthUser} from "../lib/auth";
import {logins} from "../provider/login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import CollectionOverview from "./CollectionOverview";
import Panel from "./Panel";
import packageJson from "../../package.json";
import AuthGate from "./auth/AuthGate";

export default function AppContainer({
    collections = [],
    title = "",
    login = "email",
    routes = [],
    profileMenuItems = [],
    pathPrefix = "/admin",
    authGate = async () => {},
    children
  })
{
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const {firebase, debug} = getConfiguration();


  useEffect(() => {
    if (debug) {
      console.log("schemablocks", packageJson.version);
    }
  }, []);

  function openProfileMenu(event) {
    setProfileAnchor(event.currentTarget);
  }

  function closeProfileMenu() {
    setProfileAnchor(null);
  }

  function handleLogout() {
    firebase?.auth()?.signOut().then(() => {
      setAuthUser(null);
      setUser(null);
    });
  }

  if (!user && login) {
    const Component = logins[login];
    if (Component) {
      return <Component onLogin={user => setUser(user)} />
    }
  }

  return (
    <Router>
      <AuthGate gateCondition={authGate} user={user}>
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
                      {profileMenuItems.map((item, i) => {
                        return (
                          <MenuItem onClick={item.onClick} key={"pmi" + i}>
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
                  <ListItem button onClick={() => setMenuOpen(false)}>
                    <Link to={pathPrefix + "/"} style={{ textDecoration: 'none', color: "black" }}>
                      <Typography variant={"h6"}>Overview</Typography>
                    </Link>
                  </ListItem>
                  {routes.map((item, i) => {
                    return (
                      <ListItem button key={'menuItem' + i} onClick={() => setMenuOpen(false)}>
                        <Link to={pathPrefix + item.path} style={{ textDecoration: 'none', color: "black" }}>
                          <Typography variant={"h6"}>{item.name}</Typography>
                        </Link>
                      </ListItem>
                    )
                  })}
                </List>
              </Box>
            </Drawer>
          </Box>
          <Box mt={1}>
            <Switch>
              <Route exact path={pathPrefix + "/"}>
                <CollectionOverview collections={collections} pathPrefix={pathPrefix}/>
              </Route>
              <Route path={pathPrefix + "/slug/:col/:slug"}>
                <Page collections={collections}/>
              </Route>
              {routes.map((route, i) => {
                const Component = route.component;
                return (
                  <Route exact path={pathPrefix + route.path} key={"route" + i}>
                    <Component />
                  </Route>
                )
              })}
            </Switch>
          </Box>
        </Box>
      </AuthGate>
    </Router>
  )
}

function Page({ collections }) {
  const { col, slug } = useParams();
  const collection = collections.find(c => c.value === col);
  if (collection) {
    const slugData = {
      schemas: collection.schemas,
      collection: collection.value,
      slug: slug,
      name: slug,
      publish: collection.publish,
    }
    return (
      <Panel fixedHeader={false} slug={slugData} />
    )
  }
  return false;
}

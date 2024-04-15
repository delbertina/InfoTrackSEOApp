import "./app-toolbar.css";
import { Home, Settings } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

function AppToolbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <div>
          <Link to="/">
            <IconButton
              size="large"
              aria-label="home page for application"
              color="inherit"
            >
              <Home />
            </IconButton>
          </Link>
        </div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          InfoTrack - Google SEO
        </Typography>
        <div>
          <Link to="/settings">
            <IconButton
              size="large"
              aria-label="settings for application"
              color="inherit"
            >
              <Settings />
            </IconButton>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default AppToolbar;

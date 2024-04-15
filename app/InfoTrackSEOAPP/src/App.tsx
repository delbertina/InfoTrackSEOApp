import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AppToolbar from "./components/app-toolbar/app-toolbar";
import HomePage from "./pages/home/home.page";
import SettingsPage from "./pages/settings/settings.page";
import DetailsPage from "./pages/details/details.page";
import { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { appTheme } from "./themes/theme";
import { CssBaseline } from "@mui/material";

function App() {
  let [isSimulated, setIsSimulated] = useState(true);
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <div className="app">
        <AppToolbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  isSimulated={isSimulated}
                  onIsSimulatedToggle={(value: boolean) =>
                    setIsSimulated(value)
                  }
                />
              }
            />
            <Route
              path="/details/:id"
              element={<DetailsPage isSimulated={isSimulated} />}
            />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

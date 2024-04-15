import { Alert, FormControlLabel, Switch } from "@mui/material";
import "./settings.page.css";

export interface SettingsPageProps {
  isSimulated: boolean;
  onIsSimulatedToggle: (value: boolean) => void;
}

function SettingsPage(props: SettingsPageProps) {
  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={props.isSimulated}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onIsSimulatedToggle(e.target.checked)
            }
          />
        }
        label="Simulate results on fetches with stored results"
      />
      <Alert variant="filled" severity="warning">Turning this off may cause your IP to become flagged by Google & break this application</Alert>
    </div>
  );
}

export default SettingsPage;

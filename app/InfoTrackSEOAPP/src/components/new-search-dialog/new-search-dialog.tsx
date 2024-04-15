import axios from "axios";
import { Search } from "../../types/search";
import "./new-search-dialog.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export interface NewSearchDialogProps {
  isDialogOpen: boolean;
  handleDialogClose: (newSearchId?: number) => void;
}

function NewSearchDialog(props: NewSearchDialogProps) {
  return (
    <Dialog
      open={props.isDialogOpen}
      fullWidth={true}
      maxWidth={"sm"}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const newSearch: Search = {
            id: 0, // tells API to autoincrement the ID
            searchQuery: formJson.query,
            searchDomain: formJson.domain,
            fetches: [],
          };
          // submit to API
          axios
            .post("http://localhost:5063/search/", newSearch)
            .then((res: {data?: Search}) => {
              props.handleDialogClose(res.data ? res.data.id : -1);
            })
            .catch((error: any) =>{
              // make error toast
              props.handleDialogClose();
              console.log("Error while creating new search: ", error)
            });
        },
      }}
      aria-labelledby="new-search-dialog-title"
      aria-describedby="new-search-dialog-description"
    >
      <DialogTitle id="new-search-dialog-header">New Search</DialogTitle>
      <DialogContent>
        <DialogContentText id="new-search-dialog-description">
          To create a new search, please enter a search query and domain.
        </DialogContentText>
        {/* Could do more constrained form validation here. */}
        {/* More of a future improvement due trying to use time effectively */}
        {/* Could easily be done incorrectly when rushing and have room for false negative */}
        {/* The API already sanitizes the input so just deal with for now */}
        <TextField
          autoFocus
          required
          margin="dense"
          id="query"
          name="query"
          label="Search Query"
          type="text"
          fullWidth
          variant="standard"
          placeholder="Best lawyers near me"
        />
        <TextField
          required
          margin="dense"
          id="domain"
          name="domain"
          label="Search Domain"
          type="text"
          fullWidth
          variant="standard"
          placeholder="subdomain.domain.com"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleDialogClose()}>Cancel</Button>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewSearchDialog;

import "./search-dialog.css";
import { Add } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  Typography,
  Button,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchCard from "../search-card/search-card";
import { Search } from "../../types/search";
import { useEffect, useState } from "react";
import { ColorType } from "../../types/color";
import NewSearchDialog from "../new-search-dialog/new-search-dialog";
import axios from "axios";

export interface SearchDialogProps {
  isDialogOpen: boolean;
  handleDialogClose: (id?: number) => void;
}

function SearchDialog(props: SearchDialogProps) {
  const [searchList, setSearchList] = useState<Array<Search>>([]);
  const [selectedSearch, setSelectedSearch] = useState<number>(-1);
  const [isNewSearchOpen, setIsNewSearchOpen] = useState(false);

  const handleNewSearchClose = (newSearchId?: number) => {
    setIsNewSearchOpen(false);
    if (!!newSearchId) {
      props.handleDialogClose(newSearchId);
    }
  };

  const handleSelectSearch = (index: number) => {
    if (selectedSearch === index) {
      setSelectedSearch(-1);
    } else {
      setSelectedSearch(index);
    }
  };

  useEffect(() => {
    updateSearchList();
  }, []);

  const updateSearchList = (): void => {
    axios
      .get("http://localhost:5063/search/list")
      .then((res) => {
        setSearchList(res.data);
      })
      .catch((error) =>
        // make error toast
        console.log("Error while updating search list: ", error)
      );
  };

  return (
    <>
      <Dialog
        open={props.isDialogOpen}
        onClose={() => props.handleDialogClose()}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="search-dialog-title"
        aria-describedby="search-dialog-description"
      >
        {/* header toolbar */}
        <DialogTitle id="search-dialog-header">
          <div id="search-dialog-title-column">
            <Typography
              gutterBottom
              id="search-dialog-title"
              variant="h5"
              component="div"
            >
              Searches
            </Typography>
            <Typography
              gutterBottom
              id="search-dialog-description"
              variant="body1"
              component="div"
            >
              Select an existing search or create a new one.
            </Typography>
          </div>
          <div>
            <Button
              aria-label="add new search"
              color="primary"
              size="large"
              variant="contained"
              onClick={() => setIsNewSearchOpen(true)}
              endIcon={<Add />}
            >
              New
            </Button>
          </div>
        </DialogTitle>
        <DialogContent dividers={true} id="search-dialog-content">
          {/* list of existing searches */}
          <div>
            <div>
              {[...searchList, ...searchList].map((search, i) => (
                <SearchCard
                  key={i}
                  search={search}
                  color={
                    selectedSearch === search.id
                      ? ColorType.WARNING
                      : ColorType.INFO
                  }
                  canDelete={true}
                  onDelete={() => console.log("search card deleted: ", i)}
                  onClick={() => handleSelectSearch(search.id)}
                />
              ))}
            </div>
          </div>
          {/* footer close & submit */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.handleDialogClose()}>Cancel</Button>
          <Button
            variant="contained"
            disabled={selectedSearch < 0}
            onClick={() =>
              props.handleDialogClose(
                selectedSearch < 0 ? undefined : selectedSearch
              )
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <NewSearchDialog
        isDialogOpen={isNewSearchOpen}
        handleDialogClose={(newSearchId?: number) =>
          handleNewSearchClose(newSearchId)
        }
      />
    </>
  );
}

export default SearchDialog;

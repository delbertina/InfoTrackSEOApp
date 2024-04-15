import "./home.page.css";
import { useEffect, useState } from "react";
import { Fetch } from "../../types/search";
import { Typography, Button } from "@mui/material";
import axios from "axios";
import SearchDialog from "../../components/search-dialog/search-dialog";
import { useNavigate } from "react-router-dom";
import RecentFetches from "../../components/recent-fetches/recent-fetches";

function HomePage() {
  const navigate = useNavigate();

  const [fetchList, setFetchList] = useState<Array<Fetch>>([]);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const handleSearchDialogOpen = () => {
    setIsSearchDialogOpen(true);
  };

  const handleSearchDialogClose = (index?: number) => {
    setIsSearchDialogOpen(false);
    if (!!index && index >= 0) {
      navigate("/details/" + index);
    }
  };

  const handleFetchCardClick = (index?: number) => {
    const foundFetch = fetchList.find(fetch => fetch.id === index);
    if (foundFetch) {
      navigate("/details/" + foundFetch.searchId);
    } else {
      console.log("Error while handling fetch card click: ", index);
    }
  }

  useEffect(() => {
    updateSearchList();
  }, []);

  const updateSearchList = (): void => {
    axios
      .get("http://localhost:5063/fetch/list")
      .then((res) => {
        setFetchList(res.data);
      })
      .catch((error) =>
        // make error toast
        console.log("Error while updating search list: ", error)
      )
  };

  return (
    <div className="home-content">
      <Button
        id="home-select-search"
        color="error"
        variant="contained"
        onClick={handleSearchDialogOpen}
      >
        <div>
          <Typography gutterBottom variant="h5" component="div">
            No Search Selected
          </Typography>
          <Typography gutterBottom variant="caption" component="div">
            Click to select an existing search to fetch or create a new one.
          </Typography>
        </div>
      </Button>
      <RecentFetches
        fetches={fetchList}
        onClick={(index: number) => handleFetchCardClick(index)}
      />
      <SearchDialog
        isDialogOpen={isSearchDialogOpen}
        handleDialogClose={(index?: number) => handleSearchDialogClose(index)}
      />
    </div>
  );
}

export default HomePage;

import "./details.page.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, SearchLoading } from "../../types/search";
import axios from "axios";
import SearchCard from "../../components/search-card/search-card";
import { ColorType } from "../../types/color";
import { Button } from "@mui/material";
import SearchDialog from "../../components/search-dialog/search-dialog";
import RecentFetches from "../../components/recent-fetches/recent-fetches";
import { ScatterChart } from "@mui/x-charts";
import { dataset_1, dataset_2, dataset_3 } from "./details-graph-data";

export interface DetailsPageProps {
  isSimulated: boolean;
}

function DetailsPage(props: DetailsPageProps) {
  let { id } = useParams();
  const navigate = useNavigate();
  // Just want it to display some different sets of data
  //    to show what this could be here
  let dataset =
    Math.ceil(Math.random() * 3) === 1
      ? dataset_1
      : Math.ceil(Math.random() * 3) === 2
      ? dataset_2
      : dataset_3;

  const [isNewFetchLoading, setIsNewFetchLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState<Search>(SearchLoading);
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

  useEffect(() => {
    getSearch();
  }, []);

  const getSearch = (): void => {
    axios
      .get("http://localhost:5063/search/" + id)
      .then((res) => {
        setCurrentSearch(res.data);
      })
      .catch((error) =>
        // make error toast
        console.log("Error while fetching search: ", error)
      );
  };

  const newFetch = async (): Promise<void> => {
    setIsNewFetchLoading(true);
    if (!props.isSimulated) {
      await axios
        .get("http://localhost:5063/scrape/update/" + id)
        .then((res) => {
          console.log("Successfully updated fetch results: " + id);
        })
        .catch((error) =>
          // make error toast
          console.log("Error while updating fetch results: ", error)
        );
    }
    await axios
      .get("http://localhost:5063/scrape/parse/" + id)
      .then((res) => {
        setCurrentSearch({
          ...currentSearch,
          fetches: [...currentSearch.fetches, res.data],
        });
      })
      .catch((error) =>
        // make error toast
        console.log("Error while parsing new fetch: ", error)
      )
      .finally(() => setIsNewFetchLoading(false));
  };

  return (
    <div className="details-content">
      <div>
        <SearchCard
          search={currentSearch}
          color={ColorType.SECONDARY}
          onClick={handleSearchDialogOpen}
        />
        <div className="details-new-fetch">
          <Button
            variant="contained"
            size="large"
            disabled={currentSearch.id < 0 || isNewFetchLoading}
            onClick={() => newFetch()}
          >
            New Fetch
          </Button>
        </div>
      </div>
      <div>
        <ScatterChart
          height={300}
          yAxis={[{ label: "Rank" }]}
          xAxis={[{ label: "Day of the Month" }]}
          series={[
            {
              label: "Fetch Hits",
              data: dataset,
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
      <RecentFetches
        fetches={currentSearch.fetches}
        onClick={(index: number) => console.log("fetch card clicked: " + index)}
      />
      <SearchDialog
        isDialogOpen={isSearchDialogOpen}
        handleDialogClose={(index?: number) => handleSearchDialogClose(index)}
      />
    </div>
  );
}

export default DetailsPage;

import { Typography, Divider } from "@mui/material";
import { ColorType } from "../../types/color";
import { Fetch } from "../../types/search";
import FetchCard from "../fetch-card/fetch-card";

export interface RecentFetchesProps {
  fetches: Array<Fetch>;
  onClick: (index: number) => void;
}

function RecentFetches(props: RecentFetchesProps) {
  return (
    <>
      <Typography gutterBottom variant="h4" component="div">
        Recent Fetches
      </Typography>
      <Divider />
      {props.fetches
        .sort((fetch1, fetch2) =>
          fetch1.timeStamp > fetch2.timeStamp ? -1 : 1
        )
        .map((fetch, i) => (
          <FetchCard
            key={i}
            color={ColorType.INFO}
            fetch={fetch}
            onClick={() => props.onClick(fetch.id)}
          />
        ))}
    </>
  );
}

export default RecentFetches;

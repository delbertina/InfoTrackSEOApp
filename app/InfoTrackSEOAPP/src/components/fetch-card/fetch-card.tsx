import "./fetch-card.css";
import { Fetch } from "../../types/search";
import CardWrapper from "../card-wrapper/card-wrapper";
import { Typography } from "@mui/material";
import { ColorType } from "../../types/color";

export interface FetchCardProps {
  fetch: Fetch;
  color: ColorType;
  canDelete?: boolean;
  onDelete?: () => void;
  onClick: () => void;
}

function FetchCard(props: FetchCardProps) {
  return (
    <>
      <CardWrapper
        title={"Fetch: " + props.fetch.id}
        color={props.color}
        onClick={() => props.onClick()}
        Content={() => (
          <>
            <Typography gutterBottom variant="body1" component="div">
              {"Search: " + props.fetch.searchId}
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
              {props.fetch.timeStamp > 0
                ? new Date(props.fetch.timeStamp * 1000).toLocaleString()
                : "No Timestamp"}
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
              {"Total Hits: " + props.fetch.fetchHits.length}
            </Typography>
            {!!props.fetch.fetchHits.length && (
              <Typography variant="body1" component="div">
                {JSON.stringify(
                  props.fetch.fetchHits.map((hit) => hit.hitIndex + 1)
                )
                // Minor nitpick to add a space after every comma to be more human-readable
                  .split(",")
                  .join(", ")}
              </Typography>
            )}
          </>
        )}
      />
    </>
  );
}

export default FetchCard;

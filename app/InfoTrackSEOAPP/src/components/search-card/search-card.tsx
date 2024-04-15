import "./search-card.css";
import { Search } from "../../types/search";
import CardWrapper from "../card-wrapper/card-wrapper";
import { Typography } from "@mui/material";
import { ColorType } from "../../types/color";

export interface SearchCardProps {
  search: Search;
  color: ColorType;
  canDelete?: boolean;
  onDelete?: () => void;
  onClick: () => void;
}

function SearchCard(props: SearchCardProps) {
  return (
    <>
      <CardWrapper
        title={"Search: " + (props.search.id)}
        color={props.color}
        onClick={() => props.onClick()}
        Content={() => (
          <>
            <Typography gutterBottom variant="body1" component="div">
              {"Query: " + props.search.searchQuery}
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
              {"Domain: " + props.search.searchDomain}
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
              {"Fetches: " + props.search.fetches.length}
            </Typography>
          </>
        )}
      />
    </>
  );
}

export default SearchCard;

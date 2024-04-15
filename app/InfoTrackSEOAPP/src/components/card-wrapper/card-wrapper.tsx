import "./card-wrapper.css";
import { Card, CardContent, CardHeader } from "@mui/material";

export interface CardWrapperProps {
  Content: React.FunctionComponent;
  color: "warning" | "success" | "info" | "error" | "primary" | "secondary";
  title: string;
  onClick: () => void;
}

function CardWrapper(props: CardWrapperProps) {
  return (
    <>
      <Card
        onClick={() => props.onClick()}
        className="card-wrapper"
        sx={{
          backgroundColor: `${props.color}.main`,
          color: `${props.color}.contrastText`,
        }}
      >
        <CardHeader
          className="card-wrapper-header"
          title={props.title}
        ></CardHeader>
        <CardContent
          className="card-wrapper-content"
          sx={{
            backgroundColor: `${props.color}.light`,
            color: `${props.color}.contrastText`,
          }}
        >
          <props.Content />
        </CardContent>
      </Card>
    </>
  );
}

export default CardWrapper;

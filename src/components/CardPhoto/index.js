import { memo } from "react";
import { Button, Card, CardBody, CardTitle } from "reactstrap";

const Index = ({ imageUrl, title }) => {
  return (
    <Card
      className="mb-4"
      style={{
        minHeight: 580,
      }}
    >
      <div style={{ height: 400 }}>
        <img alt="Sample" src={imageUrl} height={400} width="100%" />
      </div>
      <CardBody className="d-flex flex-column justify-content-between">
        <CardTitle tag="h5">{title}</CardTitle>

        <Button color="primary">Detail</Button>
      </CardBody>
    </Card>
  );
};

export default memo(Index);

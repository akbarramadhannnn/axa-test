import { memo } from "react";
import { Spinner } from "reactstrap";

const Index = ({ height = 300 }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height }}
    >
      <Spinner />
    </div>
  );
};

export default memo(Index);

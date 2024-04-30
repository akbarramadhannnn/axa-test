import { memo } from "react";

const Container = ({ children }) => {
  return <div className="container mt-3">{children}</div>;
};

export default memo(Container);

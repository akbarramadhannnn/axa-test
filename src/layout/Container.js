import { memo } from "react";

const Container = ({ children }) => {
  return <div className="container mt-5">{children}</div>;
};

export default memo(Container);

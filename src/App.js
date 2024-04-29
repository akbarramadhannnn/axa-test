import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Posts, Albums } from "pages";

const App = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:userId" element={<Posts />} />
        <Route path="/albums/:userId" element={<Albums />} />
      </Routes>
    </Fragment>
  );
};

export default App;

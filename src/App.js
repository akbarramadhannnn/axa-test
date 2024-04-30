import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Posts, Albums, Photos } from "pages";

const App = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:userId" element={<Posts />} />
        <Route path="/albums/:userId" element={<Albums />} />
        <Route path="/albums/:userId/photos/:albumId" element={<Photos />} />
      </Routes>
    </Fragment>
  );
};

export default App;

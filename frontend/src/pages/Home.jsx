import React from "react";
import Sidebar from "../components/Sidebar";
import WorkSpace from "../components/WorkSpace";

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <WorkSpace />
    </div>
  );
};

export default Home;

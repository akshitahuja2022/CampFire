import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import HomeCamp from "./HomeCamp";
import TopCharts from "./TopCharts";
import YourCamp from "./YourCamp";
import Settings from "./Settings";

const WorkSpace = () => {
  const { activetab } = useContext(AuthContext);
  return (
    <div className="w-full p-2 text-white">
      {activetab === "homeCamp" && <HomeCamp />}
      {activetab === "topCharts" && <TopCharts />}
      {activetab === "yourCamp" && <YourCamp />}
      {activetab === "settings" && <Settings />}
    </div>
  );
};

export default WorkSpace;

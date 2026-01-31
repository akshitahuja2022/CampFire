import { useState } from "react";
import { CampContext } from "./authContext";

export const CampContextProvider = ({ children }) => {
  const [campForm, setCampForm] = useState({
    title: "",
    description: "",
    category: [],
  });

  const [yourCamps, setYourCamps] = useState([]);
  const [trendingCamps, setTrendingCamps] = useState([]);
  const [topCamps, setTopCamps] = useState([]);
  const [joinCamps, setJoinCamps] = useState([]);
  const [personalisedCamps, setPpersonalisedCamps] = useState([]);

  const [camp, setCamp] = useState(null);

  return (
    <CampContext.Provider
      value={{
        campForm,
        setCampForm,
        yourCamps,
        setYourCamps,
        trendingCamps,
        setTrendingCamps,
        topCamps,
        setTopCamps,
        joinCamps,
        setJoinCamps,
        personalisedCamps,
        setPpersonalisedCamps,
        camp,
        setCamp,
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

import { useContext, useEffect, useState } from "react";
import { AuthContext, CampContext } from "./authContext";
import { handleError } from "../notify/Notification";

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

  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { setLoading } = useContext(AuthContext);

  const [messagesByPost, setMessagesByPost] = useState({});

  const [cursor, setCursor] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchYourCamps = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/my-camps`,
          { credentials: "include" },
        );
        const result = await res.json();

        if (result.success) {
          setYourCamps(result.data.camps);
          setJoinCamps(result.data.camps);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchYourCamps();
  }, [setLoading]);

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
        open,
        setOpen,
        posts,
        setPosts,
        content,
        setContent,
        imagePreview,
        setImagePreview,
        imageFile,
        setImageFile,
        cursor,
        setCursor,
        me,
        setMe,
        messagesByPost,
        setMessagesByPost,
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

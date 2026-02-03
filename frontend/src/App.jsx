import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import VerifyOtp from "./pages/VerifyOtp";
import HomeCamp from "./components/HomeCamp";
import CreateCamp from "./components/CreateCamp";
import TopCharts from "./components/TopCharts";
import YourCamp from "./components/YourCamp";
import Settings from "./components/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetVerifyPassword from "./pages/ResetVerifyPassword";
import AccountProfile from "./pages/AccountProfile";
import SecurityPrivacy from "./pages/SecurityPrivacy";
import AddInterests from "./pages/AddInterests";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadAvatar from "./pages/UploadAvatar";
import CampFeed from "./pages/CampFeed";
import DiscussionPage from "./pages/DiscussionPage";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetVerifyPassword />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />}>
            <Route index element={<HomeCamp />} />
            <Route path="charts" element={<TopCharts />} />
            <Route path="your-camps" element={<YourCamp />} />
            <Route path="create" element={<CreateCamp />} />
            <Route path="settings" element={<Settings />} />

            <Route path="camp-feed/:id" element={<CampFeed />} />

            <Route
              path="camp-feed/:id/post/:postId"
              element={<DiscussionPage />}
            />
            <Route path="settings/account" element={<AccountProfile />} />
            <Route path="settings/privacy" element={<SecurityPrivacy />} />
            <Route path="settings/add-interest" element={<AddInterests />} />
            <Route path="settings/upload-avatar" element={<UploadAvatar />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;

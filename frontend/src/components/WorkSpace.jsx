import { Outlet } from "react-router-dom";

const WorkSpace = () => {
  return (
    <div
      className="flex-1 w-full h-[calc(100vh-49px)] p-2 text-white overflow-y-auto scrollbar-hide">
      <Outlet />
    </div>
  );
};

export default WorkSpace;

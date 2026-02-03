import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-text-muted">
      <FaSpinner className="text-accent text-3xl animate-spin" />
      <span className="text-sm tracking-wide">Loading…</span>
    </div>
  );
};

export default Loader;

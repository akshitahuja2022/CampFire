import FeedHeader from "../components/FeedHeader";
import FloatingCreateButton from "../components/FloatingCreateButton";

const CampFeed = () => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center pb-32">
      <div className="w-full max-w-3xl">
        <FeedHeader />
      </div>

      <FloatingCreateButton />
    </main>
  );
};

export default CampFeed;

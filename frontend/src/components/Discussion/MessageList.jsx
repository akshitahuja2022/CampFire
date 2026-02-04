import { useEffect, useLayoutEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({
  messagesByPost = [],
  me,
  messagesLoading,
  onEdit,
  onDelete,
}) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  // Track whether user is near bottom (don’t hijack scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;

      shouldAutoScrollRef.current = distanceFromBottom < 120;
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll only when appropriate
  useLayoutEffect(() => {
    if (shouldAutoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesByPost]);

  if (messagesLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-10">
        <p className="text-sm text-text-muted">Loading discussion…</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col px-3 py-4 sm:px-4">
      {messagesByPost.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-text-muted">
            No replies yet. Start the campfire 🔥
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {messagesByPost.map((msg, index) => {
            const prev = messagesByPost[index - 1];

            const isMine = msg.userId?._id === me || msg.userId === me;

            const showUsername =
              !isMine && (!prev || prev.userId?._id !== msg.userId?._id);

            return (
              <li key={msg._id}>
                <MessageBubble
                  message={msg}
                  isMine={isMine}
                  showUsername={showUsername}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            );
          })}
        </ul>
      )}

      {/* scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

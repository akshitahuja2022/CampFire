import MessageBubble from "./MessageBubble";

const MessageList = ({
  messagesByPost,
  me,
  messagesLoading,
  onEdit,
  onDelete,
}) => {
  if (messagesLoading) {
    return (
      <div className="py-6 text-center text-sm text-white">
        Loading discussion…
      </div>
    );
  }

  return (
    <div
      className="
        mx-auto flex max-w-3xl flex-1 flex-col gap-3 px-3 py-4 sm:px-4
      "
    >
      {messagesByPost?.length === 0 ? (
        <p className="text-center text-xs text-gray-400">
          No replies yet. Start the campfire 🔥
        </p>
      ) : (
        messagesByPost.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isMine={msg.userId?._id === me || msg.userId === me}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;

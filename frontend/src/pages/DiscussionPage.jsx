import { useContext, useEffect, useState } from "react";
import { CampContext } from "../context/authContext.js";
import { handleError } from "../notify/Notification.js";
import { socket } from "../utils/socket.js";
import MessageList from "../components/Discussion/MessageList.jsx";
import MessageInput from "../components/Discussion/MessageInput.jsx";
import { useParams } from "react-router-dom";

const DiscussionPage = () => {
  const { id: campId, postId } = useParams();

  const [messagesLoading, setMessagesLoading] = useState(false);

  const { posts, me, messagesByPost, setMe, setCursor, setMessagesByPost } =
    useContext(CampContext);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKNED_URL}/api/v1/message/get/${postId}`,
          { method: "GET", credentials: "include" },
        );
        const result = await response.json();

        const sortedMessages = (result.data.messages || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setMessagesByPost((prev) => ({
          ...prev,
          [postId]: sortedMessages,
        }));

        setCursor(result.data.cursor || null);
        setMe(result.data.me);
      } catch (error) {
        handleError(error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [setMessagesLoading, setCursor, setMe, setMessagesByPost, postId]);

  useEffect(() => {
    socket.connect();

    socket.emit("joinPost", postId);

    socket.on("message", ({ message }) => {
      setMessagesByPost((prev) => ({
        ...prev,
        [message.postId]: [...(prev[message.postId] || []), message],
      }));
    });

    socket.on("edit-message", ({ update }) => {
      setMessagesByPost((prev) => ({
        ...prev,
        [update.postId]: prev[update.postId]?.map((m) =>
          m._id === update._id ? update : m,
        ),
      }));
    });

    socket.on("delete-message", ({ messageId, postId }) => {
      setMessagesByPost((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((m) => m._id !== messageId),
      }));
    });

    return () => {
      socket.off("message");
      socket.off("edit-message");
      socket.off("delete-message");
      socket.disconnect();
    };
  }, [postId, setMessagesByPost]);

  const editMessage = (message) => {
    socket.emit("edit-message", {
      messageId: message._id,
      text: message.content,
    });
    setMessagesByPost((prev) => ({
      ...prev,
      [message.postId]: prev[message.postId]?.map((m) =>
        m._id === message._id ? { ...m, content: message.content } : m,
      ),
    }));
  };

  const deleteMessage = (messageId) => {
    setMessagesByPost((prev) => ({
      ...prev,
      [postId]: prev[postId]?.filter((msg) => msg._id !== messageId),
    }));
    socket.emit("delete-message", { messageId });
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    socket.emit("message", {
      campId,
      postId,
      text,
    });
  };

  const post = posts?.find((p) => p._id === postId);

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center bg-bg-surface">
        {/* POST HEADER */}
        <article className="w-full max-w-xl md:max-w-2xl xl:max-w-3xl px-3 sm:px-4 py-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-orange-500 text-black flex items-center justify-center font-semibold shrink-0">
                {post?.userId?.name?.[0]}
              </div>

              <div className="min-w-0">
                <p className="font-semibold truncate text-text-primary">
                  {post?.userId?.name}
                </p>
                <p className="text-sm text-text-secondary truncate">
                  @{post?.userId?.username}
                </p>
              </div>
            </div>
          </div>

          {post?.content && (
            <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap break-words">
              {post.content}
            </p>
          )}

          {post?.images?.length > 0 && (
            <img
              src={post.images[0].url}
              alt="post"
              className="w-full max-h-80 object-cover rounded-lg mt-3"
            />
          )}
        </article>

        {/* DISCUSSION */}
        <section className="w-full max-w-xl md:max-w-2xl xl:max-w-3xl flex flex-col flex-1 relative">
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <MessageList
              messagesByPost={messagesByPost[postId] || []}
              me={me}
              messagesLoading={messagesLoading}
              onEdit={editMessage}
              onDelete={deleteMessage}
            />
          </div>

          {/* INPUT (sticky-ish) */}
          <div className="sticky bottom-0 border-border bg-bg-surface px-3 py-2">
            <MessageInput onSend={sendMessage} />
          </div>
        </section>
      </main>
    </>
  );
};

export default DiscussionPage;

import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

const MessageBubble = ({ message, isMine, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);

  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const startEdit = () => {
    setMenuOpen(false);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedText(message.content);
  };

  const saveEdit = () => {
    if (!editedText.trim() || editedText === message.content) {
      cancelEdit();
      return;
    }
    onEdit({ ...message, content: editedText });
    setIsEditing(false);
  };

  return (
    <div
      className={`relative group w-fit max-w-[85%] sm:max-w-[75%]
        rounded-2xl px-4 py-3 text-sm leading-relaxed
        ${
          isMine
            ? "ml-auto bg-accent text-bg rounded-br-md"
            : "mr-auto bg-surface border border-border text-text-primary rounded-bl-md"
        }
      `}
    >
      {/* Username (only for others) */}
      {!isMine && (
        <div className="mb-1 text-[11px] font-medium text-text-secondary">
          @{message.userId?.username || "unknown"}
        </div>
      )}

      {/* Message content / edit mode */}
      {isEditing ? (
        <div className="flex items-end gap-2">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={2}
            autoFocus
            className="flex-1 resize-none rounded-lg bg-bg border border-border
                       px-2 py-2 text-sm text-text-primary outline-none
                       focus:border-accent"
          />

          <button
            onClick={saveEdit}
            className="p-1 rounded-full border border-border
                       text-text-primary hover:bg-surface transition"
            aria-label="Save edit"
          >
            <FiCheck size={18} />
          </button>

          <button
            onClick={cancelEdit}
            className="p-1 rounded-full border border-border
                       text-text-secondary hover:bg-surface transition"
            aria-label="Cancel edit"
          >
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-words font-medium">
          {message.content}
        </p>
      )}

      {/* Action trigger (explicit, not on bubble tap) */}
      {isMine && !isEditing && (
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100
                     text-text-muted hover:text-text-primary transition"
          aria-label="Message actions"
        >
          ⋯
        </button>
      )}

      {/* Action menu */}
      {isMine && menuOpen && !isEditing && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full right-0 mt-1 w-36
                     rounded-xl bg-surface border border-border shadow-lg z-20"
        >
          <button
            onClick={startEdit}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm
                       text-text-primary hover:bg-bg rounded-t-xl transition"
          >
            <FiEdit2 size={14} />
            Edit
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              onDelete(message._id);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm
                       text-text-primary hover:bg-bg rounded-b-xl transition"
          >
            <FiTrash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

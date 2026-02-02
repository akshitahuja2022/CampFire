import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { useState } from "react";

const MessageBubble = ({ message, isMine, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false); // controls dropdown visibility
  const [isEditing, setIsEditing] = useState(false); // controls inline edit
  const [editedText, setEditedText] = useState(message.content);

  const handleSave = () => {
    if (!editedText.trim() || editedText === message.content) {
      setIsEditing(false);
      setEditedText(message.content);
      return;
    }
    onEdit({ ...message, content: editedText }); // send updated message to parent
    setIsEditing(false);
  };

  return (
    <div
      className={`relative group w-fit max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed cursor-pointer
        ${
          isMine
            ? "ml-auto bg-orange-400 text-black rounded-br-md"
            : "mr-auto bg-[#151518] border border-[#232326] text-white rounded-bl-md"
        }
      `}
      onClick={() => !isEditing && setOpen(!open)} // only toggle dropdown if not editing
    >
      {!isMine && (
        <div className="mb-1 text-[11px] font-medium text-orange-300">
          @{message.userId?.username || "unknown"}
        </div>
      )}

      {/* Message content or inline edit */}
      {isEditing ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 rounded-md bg-[#232326] px-2 py-2 text-sm text-white outline-none"
          />
          <button
            onClick={handleSave}
            className="text-black border border-[#232326] rounded-full hover:bg-[#151518] hover:text-orange-400 p-1"
          >
            <FiCheck size={20} />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedText(message.content);
            }}
            className="text-black border border-[#232326] rounded-full hover:bg-[#151518] hover:text-orange-400 p-1"
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-words font-medium">
          {message.content}
        </p>
      )}

      {/* Dropdown for Edit/Delete */}
      {isMine && !isEditing && open && (
        <div className="absolute top-full right-0 mt-1 w-36 rounded-lg bg-[#1f1f23] border border-[#2a2a2f] shadow-lg z-20">
          <button
            onClick={() => {
              setOpen(false);
              setIsEditing(true); // inline edit activated
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400 hover:text-black rounded-t-lg transition"
          >
            <FiEdit2 size={14} />
            Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete(message._id);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400 hover:text-black rounded-b-lg transition"
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

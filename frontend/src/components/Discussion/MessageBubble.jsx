import {  FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

const MessageBubble = ({ message, isMine, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`relative group w-fit max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed cursor-pointer
        ${
          isMine
            ? "ml-auto bg-orange-400 text-black rounded-br-md"
            : "mr-auto bg-[#151518] border border-[#232326] text-white rounded-bl-md"
        }
      `}
    >
      {!isMine && (
        <div className="mb-1 text-[11px] font-medium text-orange-300">
          @{message.userId?.username || "unknown"}
        </div>
      )}

      <p className="whitespace-pre-wrap break-words font-medium">
        {message.content}
      </p>

      {isMine && (
        <div className="absolute top-12 right-0">
          {open && (
            <div
              className="absolute right-0 mt-1 w-36 rounded-lg bg-[#1f1f23] border border-[#2a2a2f]
                shadow-lg z-20"
            >
              <button
                onClick={() => {
                  setOpen(false);
                  onEdit(message);
                }}
                className="
                  flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400 hover:text-black rounded-t-lg transition
                "
              >
                <FiEdit2 size={14} />
                Edit
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  onDelete(message._id);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400 hover:text-black rounded-b-lg transition
                "
              >
                <FiTrash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

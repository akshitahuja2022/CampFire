import { useEffect, useRef, useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  // Auto-grow textarea WITHOUT internal scrolling
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  return (
    <div
      className="
        bg-bg
        px-3 py-2 sm:px-4
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a reply…"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="
            flex-1 resize-none rounded-2xl
            bg-surface border border-border
            px-4 py-3 text-sm font-medium
            text-text-primary placeholder-text-muted
            outline-none focus:border-accent
            overflow-hidden
          "
        />

        <button
          onClick={submit}
          disabled={!text.trim()}
          className="
            shrink-0 rounded-2xl px-5 py-3 text-sm font-semibold
            bg-accent text-bg
            hover:bg-accent-hover
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95 transition
          "
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

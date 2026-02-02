import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };
  return (
    <div className="fixed left-0 bottom-0 sm:left-auto z-10 w-full max-w-full sm:max-w-xl md:max-w-2xl xl:max-w-3xl border-t border-[#1f1f23] bg-[#0f0f11] rounded-lg">
      <div className="mx-auto flex max-w-3xl items-end gap-2 px-3 py-3 sm:px-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a reply…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="flex-1 rounded-full bg-[#151518] px-4 py-3 text-sm font-semibold text-[#fafafa]
            placeholder-text-[#a3a3a3] placeholder-font-semibold outline-none
            border border-[#232326]
          "
        />

        <button
          onClick={submit}
          className="
            shrink-0 rounded-full bg-orange-400 px-5 py-3 text-sm font-semibold text-black
            hover:bg-orange-500 active:scale-95 transition
          "
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

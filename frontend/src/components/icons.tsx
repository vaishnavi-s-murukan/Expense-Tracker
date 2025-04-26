import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

type Props = {
  onSelect: (emoji: string) => void;
};

const EmojiPickerComponent = ({ onSelect }: Props) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-10 h-10 flex items-center justify-center bg-purple-100 text-xl rounded"
        onClick={() => setShowPicker(!showPicker)}
      >
        {selectedEmoji || "😀"}
      </button>

      {showPicker && (
        <div className="absolute z-10">
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              setSelectedEmoji(emojiObject.emoji);
              setShowPicker(false);
              onSelect(emojiObject.emoji); // send emoji to parent
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;

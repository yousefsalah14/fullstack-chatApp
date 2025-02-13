import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";


function MessageInput() {
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState();
    
    const [imagePreview, setImagePreview] = useState("");
    const fileInputRef = useRef(null);
    const {sendMessage} = useChatStore()
    const handleImageChange = (e) => {
        const file = e.target.files?.[0]; // Ensure file exists
        if (!file) {
            toast.error("No file selected");
            return;
        }
    
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }
    
        setImageFile(file); // ✅ Store file for upload
    
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result); // ✅ Set preview
        reader.readAsDataURL(file);
    };
    
    const removeImage = () => {
        setImagePreview("");
        fileInputRef.current.value = "";
    }
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) { // Fix: Use imagePreview instead of imagePreview
            return toast.error("Cannot send an empty message");
        }
    
        try {
            await sendMessage(text.trim(), imageFile); // Fix: Pass correct arguments
    
            // Reset the form after sending
            setText("");
            setImagePreview(null);
    
            
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            toast.error("Error sending message", error);
        }

    }
    return (
        <div className="p-4 w-full">
             {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
        <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
 <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={24} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
        </div>
    )
}

export default MessageInput

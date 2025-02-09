import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Image, Video, X } from "lucide-react";

function AddPost() {
  // const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isStory, setIsStory] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("isStory", isStory.toString());
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Post uploaded successfully!");
        // navigate("/");
      } else {
        console.error("Error uploading post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white/60 backdrop-blur-lg rounded-xl border border-green-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            // onClick={() => navigate("/")}
            className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold">Create New {isStory ? "Story" : "Post"}</h2>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setIsStory(false)}
              className={`flex-1 py-2 rounded-full ${!isStory ? "bg-gradient-to-r from-green-500 to-blue-600 text-white" : "bg-gray-100"}`}
            >
              Post
            </button>
            <button
              type="button"
              onClick={() => setIsStory(true)}
              className={`flex-1 py-2 rounded-full ${isStory ? "bg-gradient-to-r from-green-500 to-blue-600 text-white" : "bg-gray-100"}`}
            >
              Story
            </button>
          </div>

          {!preview ? (
            <div className="border-2 border-dashed border-green-200 rounded-xl p-8 text-center">
              <input type="file" accept="image/,video/" onChange={handleFileSelect} className="hidden" id="file-input" />
              <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center space-y-2">
                <div className="flex space-x-2">
                  <Image className="w-6 h-6 text-gray-500" />
                  <Video className="w-6 h-6 text-gray-500" />
                </div>
                <span className="text-gray-500">Click to upload image or video</span>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-xl object-cover max-h-96" />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full px-4 py-2 rounded-xl border border-green-100 focus:outline-none focus:border-blue-400 bg-white/50"
            rows={4}
          />

          <button type="submit" className="w-full py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium hover:shadow-lg transition-all duration-300">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPost;
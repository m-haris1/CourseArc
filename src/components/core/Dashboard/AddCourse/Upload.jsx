import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";
import "video-react/dist/video-react.css";
import { Player } from "video-react";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);  // Reference for the hidden file input

  // Handle file drop or file select
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  // Use the react-dropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video ? { "image/*": [".jpeg", ".jpg", ".png"] } : { "video/*": [".mp4"] },
    onDrop,
  });

  // Generate preview when a file is selected
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result); // Set the preview source to the file data URL
    };
  };

  // Register field with react-hook-form
  useEffect(() => {
    register(name, { required: true });
  }, [register]);

  // Update form value when selectedFile changes
  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue]);

  // Function to handle "Browse" text click
  const handleBrowseClick = () => {
    inputRef.current.click();  // Trigger the file input click
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* Dropzone area with onClick triggering the hidden file input */}
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
        {...getRootProps()} // Get dropzone props
      >
        <input
          {...getInputProps()}
          ref={inputRef} // Hidden file input element
          className="hidden" // Hide file input
          type="file"
          accept={video ? "video/*" : "image/*"}
          onChange={(e) => onDrop(e.target.files)} // Handle file selection
        />

        {previewSource ? (
          // If a preview exists, show it
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          // If no preview, show drag-and-drop UI
          <div className="flex w-full flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span
                className="font-semibold text-yellow-50 cursor-pointer"
                onClick={handleBrowseClick} // Clicking "Browse" will trigger file input
              >
                Browse
              </span>{" "}
              a file
            </p>
            {!video && (
              <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024x576</li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Error message if no file selected */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

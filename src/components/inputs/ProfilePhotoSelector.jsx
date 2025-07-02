import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import Card from "../../assets/images/image1.jpg" 

const ProfilePhotoSelector = (props) => {
  const { image, setImage } = props;

  const inputRef = useRef(null);
  const [previewUrl, setPreviewURL] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
     console.log(image)
    if (file) {
      setImage(file);
     

    const preview = URL.createObjectURL(file);
    setPreviewURL(preview);
    console.log(image)}
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewURL(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
          <LuUser  className="text-4xl text-primary"/>

          <button type="button" className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1" onClick={onChooseFile}>
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative"> 
          <img src={previewUrl} alt="Profile picture" className="w-20 h-20 rounded-full object-cover"/>
          <button type="button" className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1"  onClick={handleRemoveImage}>
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;

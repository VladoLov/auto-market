import { db } from "../../../configs";
import { storage } from "../../../configs/firebaseConfig";

import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
  getStorage,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { CarImages } from "../../../schema";
import { IoMdCloseCircle } from "react-icons/io";
import { eq } from "drizzle-orm";

function NewUploadingImages({ triggerUploadImages, setLoader, carInfo, mode }) {
  const [selectedFileList, setSelectedFileList] = useState([]);
  const [editCarImageList, setEditCarImageList] = useState([]);

  const storage = getStorage();
  if (carInfo?.images) {
    console.log("Car Images:", carInfo.images);
  } else {
    console.log("Car info or images not available yet");
  }

  /*  useEffect(() => {
    if (mode === "edit") {
      setEditCarImageList([]);
      carInfo?.images.forEach((image) => {
        setEditCarImageList((prev) => [...prev, image?.imageUrl]);
      });
    }
  }, [carInfo, mode]); */
  useEffect(() => {
    if (mode === "edit" && carInfo?.images) {
      const images = carInfo.images.map((image) => image.imageUrl);
      setEditCarImageList(images);
    }
  }, [carInfo, mode]);

  useEffect(() => {
    if (triggerUploadImages) {
      uploadImagesToServer();
    }
  }, [triggerUploadImages]);

  const onFileSelected = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      setSelectedFileList((prev) => [...prev, file]);
    }
  };
  function onImageRemove(image, index) {
    const updatedList = selectedFileList.filter((_, i) => i !== index);
    setSelectedFileList(updatedList);
  }

  /*   async function onImageRemoveFromDB(image, index) {
    const result = await db
      .delete(CarImages)
      .where(eq(CarImages.id, carInfo?.images[index]?.id));
    const imageList = editCarImageList.filter((item) => item != image);
    setEditCarImageList(imageList);
  } */

  //this work great
  const onImageRemoveFromDB = async (imageUrl, index) => {
    try {
      // Extract file path from the URL
      const getImageNameFromUrl = (url) => {
        const parts = url.split("/o/"); // Split by '/o/' to isolate the relevant path
        if (parts.length > 1) {
          const filePath = parts[1].split("?")[0]; // Remove the query parameters
          return decodeURIComponent(filePath); // Decode to handle any URL encoding
        }
        return null;
      };
      const filePath = getImageNameFromUrl(imageUrl);

      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, filePath);

      // Delete the file from Firebase Storage
      await deleteObject(fileRef);
      console.log("Image removed from Firebase Storage");

      // Remove image from database
      const result = await db
        .delete(CarImages)
        .where(eq(CarImages.imageUrl, imageUrl))
        .returning();

      // Update the editCarImageList to reflect the deletion
      const updatedList = editCarImageList.filter((_, i) => i !== index);
      setEditCarImageList(updatedList);
      console.log("Image removed from DB:", result);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  // Utility function to extract the image name from the URL
  /*   const getImageNameFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split("?")[0]; // This gets the file name from the URL
  }; */

  async function uploadImagesToServer() {
    setLoader(true);
    selectedFileList.forEach(async (file) => {
      const fileName = Date.now() + ".jpeg";
      const storageRef = ref(storage, "car-marketplace/" + fileName);
      const metaData = {
        contentType: "image/jpeg",
      };
      await uploadBytes(storageRef, file, metaData)
        .then((snapShot) => {
          console.log("Upload File");
        })
        .then((resp) => {
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            console.log(downloadUrl);
            await db.insert(CarImages).values({
              imageUrl: downloadUrl,
              carListingId: triggerUploadImages,
            });
          });
        });
      setLoader(false);
    });
  }

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload car images</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {mode == "edit" &&
          editCarImageList.map((image, index) => (
            <div key={index}>
              <IoMdCloseCircle
                className="absolute m-2 text-lg text-white"
                onClick={() => onImageRemoveFromDB(image, index)}
              />
              <img src={image} className="w-full h-[130px] object-cover" />
            </div>
          ))}

        {selectedFileList.map((image, index) => (
          <div key={index}>
            <IoMdCloseCircle
              className="absolute m-2 text-lg text-white"
              onClick={() => onImageRemove(image, index)}
            />
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-[130px] object-cover"
            />
          </div>
        ))}
        <label htmlFor="upload-images">
          <div className="border rounded-xl border-dotted border-primary bg-blue-100 p-10 cursor-pointer hover:shadow-sm">
            <h2 className="text-lg text-center text-primary">+</h2>
          </div>
        </label>
        <input
          type="file"
          multiple={true}
          id="upload-images"
          onChange={onFileSelected}
          className="opacity-0"
        />
      </div>
    </div>
  );
}

export default NewUploadingImages;

import { db } from "../../../configs";
import { storage } from "../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { CarImages } from "../../../schema";

function UploadingImages({ triggerUploadImages, setLoader }) {
  const [selectedFileList, setSelectedFileList] = useState([]);

  useEffect(() => {
    if (triggerUploadImages) {
      uploadImagesToServer();
    }
  }, [triggerUploadImages]);

  const onFileSelected = (e) => {
    const files = e.target.files;

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];

      /*  const objectUrl = URL.createObjectURL(file); */
      setSelectedFileList((prev) => [...prev, file]);
    }
  };

  function onImageRemove(image, index) {
    const result = selectedFileList.filter((item) => item != image);
    setSelectedFileList(result);
  }

  async function uploadImagesToServer() {
    setLoader(true);
    await selectedFileList.forEach(async (file) => {
      const fileName = Date.now() + ".jpeg";
      const storageRef = ref(storage, "car-marketplace/" + fileName);
      const metaData = {
        contentType: "image/jpeg",
      };
      await uploadBytes(storageRef, file, metaData)
        .then((snapShot) => {
          console.log("Upload file");
        })
        .then((resp) => {
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            console.log(downloadUrl);
            await db.insert(CarImages).values({
              imageUrl: downloadUrl,
              carListingId: triggerUploadImages,
            });
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle the error appropriately (e.g., display an error message to the user)
        });
      setLoader(false);
    });
  }

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload car images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {selectedFileList.map((image, index) => (
          <div key={index}>
            <IoMdCloseCircle
              className="absolute m-2 text-lg text-white cursor-pointer"
              onClick={() => onImageRemove(image, index)}
            />

            <img
              src={URL.createObjectURL(image)}
              className="w-full he-[130] object-cover rounded-xl"
              alt=""
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

export default UploadingImages;

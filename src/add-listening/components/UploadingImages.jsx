import { db } from "../../../configs";
import { storage } from "../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { CarImages } from "../../../schema";

const { IoMdCloseCircle } = "react-icons/io";

function UploadingImages({
  triggerUploadImages,
  setLoader,
  existingImages = [],
  onDeleteImage,
  carInfo = {},
  mode,
}) {
  const [selectedFileList, setSelectedFileList] = useState([]);
  const [editCarImageList, setEditCarImageList] = useState([]);

  // Populate editCarImageList for editing mode
  useEffect(() => {
    if (mode === "edit" && Array.isArray(carInfo.images)) {
      setEditCarImageList(
        carInfo.images.map((image) => ({
          ...image,
          imageUrl: image.imageUrl || "",
        }))
      );
    }
  }, [mode, carInfo.images]);

  // Trigger upload when needed
  useEffect(() => {
    if (triggerUploadImages && selectedFileList.length > 0) {
      uploadImagesToServer();
    }
  }, [triggerUploadImages, selectedFileList]);

  const onFileSelected = (e) => {
    const files = e.target.files;
    if (files) {
      setSelectedFileList((prev) => [...prev, ...Array.from(files)]);
    }
  };

  function onImageRemove(file, index) {
    const updatedList = selectedFileList.filter((_, i) => i !== index);
    setSelectedFileList(updatedList);
  }

  async function uploadImagesToServer() {
    try {
      setLoader(true);

      const uploadPromises = selectedFileList.map(async (file) => {
        const fileName = Date.now() + ".jpeg";
        const storageRef = ref(storage, "car-marketplace/" + fileName);
        const metaData = { contentType: "image/jpeg" };

        await uploadBytes(storageRef, file, metaData);
        const downloadUrl = await getDownloadURL(storageRef);

        await db.insert(CarImages).values({
          imageUrl: downloadUrl,
          carListingId: triggerUploadImages,
        });
      });

      await Promise.all(uploadPromises);
      setSelectedFileList([]);
      setLoader(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoader(false);
    }
  }

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload car images</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {editCarImageList.map((image, index) => (
          <div key={image.id || index} className="relative">
            <IoMdCloseCircle
              className="absolute m-2 text-lg text-white cursor-pointer"
              onClick={() => onDeleteImage(image.id)}
            />
            <img
              src={image.imageUrl}
              className="w-full h-[130px] object-cover rounded-xl"
              alt=""
            />
          </div>
        ))}
        {selectedFileList.map((file, index) => (
          <div key={index} className="relative">
            <IoMdCloseCircle
              className="absolute m-2 text-lg text-white cursor-pointer"
              onClick={() => onImageRemove(file, index)}
            />
            <img
              src={URL.createObjectURL(file)}
              className="w-full h-[130px] object-cover rounded-xl"
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
          multiple
          id="upload-images"
          onChange={onFileSelected}
          className="opacity-0"
        />
      </div>
    </div>
  );
}
export default UploadingImages;

/* 
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

      // const objectUrl = URL.createObjectURL(file);
      setSelectedFileList((prev) => [...prev, file]);
    }
  };

  //  function onImageRemove(image, index) {
    // const result = selectedFileList.filter((item) => item != image);
   //  setSelectedFileList(result);
 // }

  function onImageRemove(image, index) {
    const updatedList = selectedFileList.filter((_, i) => i !== index);
    setSelectedFileList(updatedList);
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
  async function uploadImagesToServer() {
    try {
      setLoader(true);

      const uploadPromises = selectedFileList.map(async (file) => {
        const fileName = Date.now() + ".jpeg";
        const storageRef = ref(storage, "car-marketplace/" + fileName);
        const metaData = {
          contentType: "image/jpeg",
        };

        const snapShot = await uploadBytes(storageRef, file, metaData);
        console.log("Uploaded file", snapShot);

        const downloadUrl = await getDownloadURL(storageRef);
        // console.log(downloadUrl);

        await db.insert(CarImages).values({
          imageUrl: downloadUrl,
          carListingId: triggerUploadImages,
        });
      });

      await Promise.all(uploadPromises);
      setLoader(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoader(false);
    }
  }

  return (
    <div>
      <h2 className="font-medium text-xl my-3">Upload car images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {selectedFileList.map((image, index) => (
          <div key={index} className="relative">
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

export default UploadingImages;*/

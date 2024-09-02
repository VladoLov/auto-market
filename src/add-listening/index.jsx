import Header from "@/components/Header";
import carDetails from "../assets/Shared/carDetails.json";
import InputField from "./components/InputField";
import DropdownField from "./components/DropdownField";
import TextArea from "./components/TextArea";
import { Separator } from "@radix-ui/react-separator";
import features from "../assets/Shared/features.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CarImages, CarListing } from "../../schema";
import { db } from "../../configs/index";
import IconField from "./components/IconField";
import UploadingImages from "./components/UploadingImages";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { useUser } from "@clerk/clerk-react";
import { eq } from "drizzle-orm";
import Service from "@/assets/Shared/Service";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../configs/firebaseConfig";
import NewUploadingImages from "./components/NewUploadingImages";

function AddListing() {
  const [formData, setFormData] = useState([]);
  const [featuresData, setFeaturesData] = useState([]);
  const [triggerUploadImages, setTriggerUploadImages] = useState();
  const [loader, setLoader] = useState(false);
  const [carInfo, setCarInfo] = useState([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const mode = searchParams.get("mode");

  const recordId = searchParams.get("id");

  useEffect(() => {
    if (recordId) {
      getListingDetail();
    }
  }, []);

  async function getListingDetail() {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.id, recordId));

    const resp = Service.FormatResult(result);
    setCarInfo(resp[0]);
    setFeaturesData(resp[0].features);
    setFormData(resp[0]);

    /* console.log(resp); */
  }
  /**
 
Use to capture user form from}
 
   */
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  /**
 Use to save selected features list
 */
  const handleFeaturesChange = (name, value) => {
    setFeaturesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    /*  console.log(featuresData); */
  };

  /*  const onSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    console.log(formData);
    toast("Please Wait...");

    if (mode === "edit") {
      const result = await db
        .update(CarListing)
        .set({
          ...formData,
          features: featuresData,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          userImageUrl: user?.imageUrl,
          postedOn: moment().format("DD/MM/yyyy"),
        })
        .where(eq(CarListing.id, recordId))
        .returning({ id: CarListing.id });
      console.log(result);
      setLoader(false);
    } else {
      try {
        const result = await db
          .insert(CarListing)
          .values({
            ...formData,
            features: featuresData,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            postedOn: moment().format("DD/MM/yyyy"),
          })
          .returning({ id: CarListing.id });

        if (result) {
          console.log("Data saved");
          setTriggerUploadImages(result[0]?.id);
          setLoader(false);
        }
      } catch (e) {
        console.log("Error", e);
      }
    }
  }; */
  /* const onSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoader(true); // Set the loader state

    console.log(formData); // Log the formData for debugging
    toast("Please Wait..."); // Display a toast message

    try {
      if (mode === "edit") {
        // Update the existing record
        const result = await db
          .update(CarListing)
          .set({
            ...formData, // Spread formData to populate the fields
            features: featuresData, // Set the featuresData
            createdBy: user?.primaryEmailAddress?.emailAddress, // Set the createdBy field
            userName: user?.fullName, // Set the userName field
            userImageUrl: user?.imageUrl, // Set the userImageUrl field
            postedOn: moment().format("DD/MM/yyyy"), // Set the postedOn date
          })
          .where(eq(CarListing.id, recordId)) // Filter by recordId
          .returning({ id: CarListing.id }); // Return the id of the updated record
         navigate("/profile"); 
        console.log(result); // Log the result for debugging
      } else {
        // Insert a new record
        const result = await db
          .insert(CarListing)
          .values({
            ...formData, // Spread formData to populate the fields
            features: featuresData, // Set the featuresData
            createdBy: user?.primaryEmailAddress?.emailAddress, // Set the createdBy field
            postedOn: moment().format("DD/MM/yyyy"), // Set the postedOn date
          })
          .returning({ id: CarListing.id }); // Return the id of the new record

        if (result) {
          console.log("Data saved"); // Log a success message
          setTriggerUploadImages(result[0]?.id); // Trigger the image upload
        }
      }
    } catch (e) {
      console.error("Error:", e); // Log any errors
    } finally {
      setLoader(false); // Set the loader state to false
    }
  }; */
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    console.log(formData);
    toast("Please Wait...");

    try {
      let result;
      if (mode === "edit") {
        result = await db
          .update(CarListing)
          .set({
            ...formData,
            features: featuresData,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName,
            userImageUrl: user?.imageUrl,
            postedOn: moment().format("DD/MM/yyyy"),
          })
          .where(eq(CarListing.id, recordId))
          .returning({ id: CarListing.id });
        await setTriggerUploadImages(result[0]?.id);
        setLoader(false);
        navigate("/profile");

        console.log(result);
      } else {
        result = await db
          .insert(CarListing)
          .values({
            ...formData,
            features: featuresData,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            postedOn: moment().format("DD/MM/yyyy"),
          })
          .returning({ id: CarListing.id });
        if (result) {
          console.log("Data saved");
          await setTriggerUploadImages(result[0]?.id);
          navigate("/profile");
        }
      }

      // Trigger the image upload in both edit and create mode
      /*     if (result && result[0]?.id) {
        await new Promise((resolve) => {
          setTriggerUploadImages(result[0].id, resolve);
        });
      } */
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoader(false);
    }
  };

  /*  async function onDeleteImage(imageId) {
    try {
      // Find the image record in the database by imageId
      const imageRecord = await db
        .select()
        .from(CarImages)
        .where(eq(CarImages.id, imageId))
        .first();

      if (imageRecord) {
        // Delete the image from Firebase Storage
        const imageRef = ref(storage, imageRecord.imageUrl);
        await deleteObject(imageRef);

        // Delete the image record from the database
        await db.delete(CarImages).where(eq(CarImages.id, imageId));

        // Optionally, update the UI to remove the image from the state
        setCarInfo((prev) => ({
          ...prev,
          images: prev.images.filter((image) => image.id !== imageId),
        }));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  } */

  async function onDeleteImage(imageId) {
    try {
      // Find the image record in the database by imageId
      const imageRecords = await db
        .select()
        .from(CarImages)
        .where(eq(CarImages.id, imageId));

      if (imageRecords.length > 0) {
        const imageRecord = imageRecords[0];

        // Delete the image from Firebase Storage
        const imageRef = ref(storage, imageRecord.imageUrl);
        await deleteObject(imageRef);

        // Delete the image record from the database
        await db.delete(CarImages).where(eq(CarImages.id, imageId));

        // Optionally, update the UI to remove the image from the state
        setCarInfo((prev) => ({
          ...prev,
          images: prev.images.filter((image) => image.id !== imageId),
        }));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        <h2 className="font-bold text-4xl">Add new listing</h2>
        <form className="p-10 border rounded-xl mt-10">
          {/**Car details */}
          <div>
            <h2 className="font-medium text-xl mb-6">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {carDetails.carDetails.map((item, index) => (
                <div key={index}>
                  <label className="text-sm flex gap-2 items-center mb-1">
                    <IconField icon={item.icon} />
                    {item.label}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      carInfo={carInfo}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextArea
                      item={item}
                      carInfo={carInfo}
                      handleInputChange={handleInputChange}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-6" />
          {/**features list  */}
          <div>
            <h2 className="font-medium text-xl my-6">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.features.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Checkbox
                    onCheckedChange={(value) =>
                      handleFeaturesChange(item.name, value)
                    }
                    checked={featuresData?.[item.name]}
                  />{" "}
                  <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-6" />
          {/**Car images */}
          <NewUploadingImages
            triggerUploadImages={triggerUploadImages}
            carInfo={carInfo}
            mode={mode}
            setLoader={(v) => {
              setLoader(v);
            }}
            onDeleteImage={onDeleteImage}
          />
          <div className="mt-10 flex justify-end">
            <Button
              type="button"
              disabled={loader}
              onClick={(e) => onSubmit(e)}
            >
              {!loader ? (
                "Submit"
              ) : (
                <BiLoaderAlt className="animate-spin text-lg" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListing;

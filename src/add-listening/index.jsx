import Header from "@/components/Header";
import carDetails from "../assets/Shared/carDetails.json";
import InputField from "./components/InputField";
import DropdownField from "./components/DropdownField";
import TextArea from "./components/TextArea";
import { Separator } from "@radix-ui/react-separator";
import features from "../assets/Shared/features.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CarListing } from "../../schema";
import { db } from "../../configs/index";
import IconField from "./components/IconField";
import UploadingImages from "./components/UploadingImages";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "@/components/ui/use-toast";
import { useNavigation } from "react-router-dom";

function AddListing() {
  const [formData, setFormData] = useState([]);
  const [featuresData, setFeaturesData] = useState([]);
  const [triggerUploadImages, setTriggerUploadImages] = useState();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigation();

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
    console.log(featuresData);
  };

  const onSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    console.log(formData);
    toast("Please Wait...");
    try {
      const result = await db
        .insert(CarListing)
        .values({ ...formData, features: featuresData })
        .returning({ id: CarListing.id });

      if (result) {
        console.log("Data saved");
        setTriggerUploadImages(result[0]?.id);
        setLoader(false);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

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
                    {item.label}{" "}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextArea
                      item={item}
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
                  />{" "}
                  <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-6" />
          {/**Car images */}
          <UploadingImages
            triggerUploadImages={triggerUploadImages}
            setLoader={(setLoader, navigate("/profile"))}
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

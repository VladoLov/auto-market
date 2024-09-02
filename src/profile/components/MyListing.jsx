import { Button } from "@/components/ui/button";
import { db } from "../../../configs";
import { Link } from "react-router-dom";
import { CarImages, CarListing } from "../../../schema";
import { desc, eq } from "drizzle-orm";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Service from "../../assets/Shared/Service";
import CarListItem from "@/components/CarListItem";

import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../configs/firebaseConfig";
import AlertDeleteDialog from "./AlertDeleteDialog";

// import FormatResult from "../../assets/Shared/Service";
function MyListing() {
  const { user } = useUser();
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    user && getUserCarListing();
  }, [user]);
  async function getUserCarListing() {
    const result = await db
      .select()
      .from(CarListing)
      .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(CarListing.id));

    const resp = Service.FormatResult(result);
    /*  console.log(resp);
    console.log(result); */
    setCarList(resp);
  }

  async function deleteCarListing(listingId) {
    try {
      const images = await db
        .select()
        .from(CarImages)
        .where(eq(CarImages.carListingId, listingId));
      for (const image of images) {
        const imageRef = ref(storage, image.imageUrl);
        await deleteObject(imageRef);
      }

      await db.delete(CarImages).where(eq(CarImages.carListingId, listingId));

      await db.delete(CarListing).where(eq(CarListing.id, listingId));

      setCarList((prev) => prev.filter((item) => item.id !== listingId));
    } catch (error) {
      console.error("Error deleting car listing", error);
    }
  }
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-4xl">My Listing</h2>
        <Link to={"/add-listing"}>
          <Button>+ Add New Listening</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-5">
        {carList.map((item, index) => (
          <div key={index}>
            <CarListItem car={item} />
            <div className="p-2 bg-gray-50 rounded-lg flex gap-2 justify-between">
              <Link
                className="w-full"
                to={"/add-listing?mode=edit&id=" + item?.id}
              >
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </Link>

              {/*    <Button
                variant="destructive"
                deleteCarListing={deleteCarListing}
                carList={carList}
              >
                <FaTrashCan />
              </Button> */}
              <AlertDeleteDialog
                variant="destructive"
                deleteCarListing={deleteCarListing}
                listingId={item.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListing;

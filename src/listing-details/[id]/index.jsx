import Header from "@/components/Header";
import DeatailHeader from "../Comonents/DeatailHeader";
import { useParams } from "react-router-dom";
import { CarImages, CarListing } from "../../../schema";
import { eq } from "drizzle-orm";
import { db } from "../../../configs";
import { useEffect, useState } from "react";
import Service from "@/assets/Shared/Service";
import ImageGallery from "../Comonents/ImageGallery";
import Description from "../Comonents/Description";
import Features from "../Comonents/Features";

function ListingDetail() {
  const { id } = useParams();

  const [carDetail, setCarDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCarDetail();
  }, []);
  console.log(id);
  /*  async function getCarDetail() {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.id, id));

    const resp = Service.FormatResult(result);
    setCarDetail(resp[0]);
  } */

  async function getCarDetail() {
    try {
      const result = await db
        .select()
        .from(CarListing)
        .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
        .where(eq(CarListing.id, id));

      const resp = Service.FormatResult(result);
      setCarDetail(resp[0]);
    } catch (error) {
      console.error("Error fetching car details:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator
  }

  if (!carDetail) {
    return <div>No car details available.</div>; // Handle the case where no data is found
  }
  return (
    <div>
      <Header />

      {/**Header Detail Component */}
      <div className="p-10 md:p-20">
        <DeatailHeader carDetail={carDetail} />
        <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-10 gap-5">
          {/**Left */}
          <div className="md:col-span-2">
            {/*  Image Gallery */}
            <ImageGallery carDetail={carDetail} />
            {/*  Description */}
            <Description carDetail={carDetail} />
            {/*  Features List */}
            <Features features={carDetail?.features} />
          </div>
          {/**Right */}
          <div className="">
            {/*  Pricing */}
            {/*  Car Properties */}
            {/*  Owners Detail */}
          </div>
        </div>
      </div>
      <h2>Listing Subtitles</h2>
    </div>
  );
}

export default ListingDetail;

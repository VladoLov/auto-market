import FakeData from "@/assets/Shared/FakeData";
import CarListItem from "./CarListItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "../../configs";
import { CarImages, CarListing } from "../../schema";

import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import Service from "@/assets/Shared/Service";

function MostSearchedCar() {
  const [carList, setCarList] = useState([]);
  /* console.log(FakeData.carList); */

  useEffect(() => {
    getPopularCarList();
  }, []);

  async function getPopularCarList() {
    const result = await db
      .select()
      .from(CarListing)
      .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .orderBy(desc(CarListing.id))
      .limit(10);
    // console.log(result);
    const resp = Service.FormatResult(result);
    setCarList(resp);
    console.log(resp);
  }
  return (
    <div className="mx-24">
      <h2 className="font-bold text-3xl text-center my-16">
        Most Searched Car
      </h2>
      <Carousel>
        <CarouselContent>
          {carList.map((car, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5">
              <CarListItem car={car} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default MostSearchedCar;

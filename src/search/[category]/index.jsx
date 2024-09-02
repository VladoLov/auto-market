import Header from "@/components/Header";
import Search from "@/components/Search";
import { eq } from "drizzle-orm";
import { useParams } from "react-router-dom";
import { CarImages, CarListing } from "../../../schema";
import { useEffect, useState } from "react";
import { db } from "../../../configs";
import Service from "@/assets/Shared/Service";
import CarListItem from "@/components/CarListItem";

function SearchByCategory() {
  const { category } = useParams();
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    getCarList();
  }, []);
  const getCarList = async () => {
    const result = await db
      .select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .where(eq(CarListing.category, category));
    const resp = Service.FormatResult(result);
    setCarList(resp);
  };

  return (
    <div>
      <Header />
      <div className="p-6 bg-black flex justify-center">
        <Search />
      </div>
      <div className="pt-6 md:px-20">
        <h2 className="font-bold text-4xl p-10 ">{category}</h2>
        {/**List of CarList */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7">
          {carList?.length > 0
            ? carList.map((item, index) => (
                <div key={index}>
                  <CarListItem car={item} />
                </div>
              ))
            : [1, 2, 3, 4].map((item, index) => (
                <div
                  key={index}
                  className="h-[300px] rounded-xl bg-slate-200 animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default SearchByCategory;

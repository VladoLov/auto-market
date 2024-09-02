import { Separator } from "./ui/separator";
import { GiRoad } from "react-icons/gi";
import { MdOutlineSpeed } from "react-icons/md";
import { TbManualGearboxFilled } from "react-icons/tb";
import { MdOutlineOpenInNew } from "react-icons/md";

function CarListItem({ car }) {
  return (
    <div className="rounded-xl bg-white border hover:shadow-lg cursor-pointer">
      <h2 className="absolute m-2 bg-green-500 px-2 rounded-full text-sm pb-1 text-white">
        {car?.condition}
      </h2>
      <img
        src={car?.images[0]?.imageUrl}
        width={"100%"}
        height={250}
        className="rounded-t-xl h-[180px] object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-black text-lg mb-2">
          {car?.listingTitle}
        </h2>
        <Separator />
        <div className="grid grid-cols-3 mt-5">
          <div className="flex flex-col items-center">
            <GiRoad className="text-lg mb-2" />
            <h2>{car?.mileage} Miles</h2>
          </div>
          <div className="flex flex-col items-center">
            <MdOutlineSpeed className="text-lg mb-2" />
            <h2>{car?.fuelType} </h2>
          </div>
          <div className="flex flex-col items-center">
            <TbManualGearboxFilled className="text-lg mb-2" />
            <h2>{car?.transmission} </h2>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between ">
          <h2 className="font-bold text-xl">${car.sellingPrice}</h2>
          <h2 className="text-primary text-sm flex gap-2 items-center">
            <MdOutlineOpenInNew />
            View Details
          </h2>
        </div>
      </div>
    </div>
  );
}

export default CarListItem;

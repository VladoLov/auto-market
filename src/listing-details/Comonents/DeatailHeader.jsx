import { CalendarIcon } from "@radix-ui/react-icons";
import { FaGasPump, FaPumpMedical, FaPumpSoap } from "react-icons/fa";
import { GiGearStickPattern } from "react-icons/gi";

import { IoIosSpeedometer } from "react-icons/io";

function DeatailHeader({ carDetail }) {
  console.log(carDetail);
  return (
    <div>
      {carDetail?.listingTitle ? (
        <div>
          <h2 className="font-bold text-xl">{carDetail?.listingTitle}</h2>
          <p className="text-sm">{carDetail?.tagLine}</p>

          <div className="flex gap-2 mt-3">
            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <CalendarIcon className="h-7 w-7  text-primary" />
              <h2 className="text-primary text-sm">{carDetail?.year}</h2>
            </div>
            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <IoIosSpeedometer className="h-7 w-7 text-primary" />
              <h2 className="text-primary text-sm">{carDetail?.mileage}</h2>
            </div>
            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <GiGearStickPattern className="h-7 w-7  text-primary" />
              <h2 className="text-primary text-sm">
                {carDetail?.transmission}
              </h2>
            </div>
            <div className="flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3">
              <FaGasPump className="h-7 w-7  text-primary" />
              <h2 className="text-primary text-sm">{carDetail?.fuelType}</h2>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl h-[100px] bg-slate-200 animate-pulse"></div>
      )}
    </div>
  );
}

export default DeatailHeader;

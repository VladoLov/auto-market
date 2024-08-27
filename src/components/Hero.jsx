import Search from "./Search";
import tesla from "../assets/tesla.png";

function Hero() {
  return (
    <div>
      <div className="flex flex-col items-center p-10 py-20 gap-6 h-[600] w-full bg-[#eef0fc]">
        <h2 className="text-lg">Find cars for sale and for rent near you</h2>
        <h2 className="text-[65px] font-bold">Find Your Dream Car</h2>
        <Search />
        <img src={tesla} alt="car image" className="mt-10" />
      </div>
    </div>
  );
}

export default Hero;

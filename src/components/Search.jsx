import Data from "@/assets/Shared/Data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-separator";
import { IoIosSearch } from "react-icons/io";

function Search() {
  return (
    <div className="p-2 md:p-5 bg-white rounded-md md:rounded-full flex-col md:flex md:flex-row gap-10 items-center w-[60%] ">
      <Select>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none">
          <SelectValue placeholder="Cars" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">New</SelectItem>
          <SelectItem value="dark">Old</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="hidden md:block" />

      <Select>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none ">
          <SelectValue placeholder="Car Makes" />
        </SelectTrigger>
        <SelectContent>
          {Data.CarMakes.map((maker, index) => (
            <SelectItem value={maker.name} key={index}>
              {maker.name}
            </SelectItem>
          ))}
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" />

      <Select>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none">
          <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent>
          {Data.Pricing.map((price, index) => (
            <SelectItem value={price.amount} key={index}>
              {price.amount}$
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        <IoIosSearch className="text-[45px] bg-primary rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer" />
      </div>
    </div>
  );
}

export default Search;

import FakeData from "@/assets/Shared/FakeData";
import CarListItem from "./CarListItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function MostSearchedCar() {
  console.log(FakeData.carList);
  return (
    <div className="mx-24">
      <h2 className="font-bold text-3xl text-center my-16">
        Most Searched Car
      </h2>
      <Carousel>
        <CarouselContent>
          {FakeData.carList.map((car, index) => (
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

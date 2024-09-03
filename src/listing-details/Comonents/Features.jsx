import { FaCheck } from "react-icons/fa";

function Features({ features }) {
  return (
    <div className="">
      <div className="p-10 bg-white rounded-xl border shadow-md my-7">
        <h2 className="font-medium text-2xl">Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg: grid-cols-4">
          {Object.entries(features).map(([features, value], index) => (
            <div key={index}>
              <FaCheck className="h-8 w-8 bg-blue-200 text-primary" />
              <h2>{features} </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;

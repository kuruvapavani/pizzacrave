import React from "react";
const MyOrderPizzaCard = ({
  name = "Pizza Name",
  price = 299,
  image,
  quantity,
  variant,
}) => {
  return (
    <div className="flex flex-col border-4 border-hero rounded-3xl max-w-96 p-6 bg-white shadow-lg relative">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center gap-2">
          <div className="text-xl text-gray-800">{name}</div>
          <div className="flex items-center gap-2">
            <label className="font-medium">Variant:</label>
            <div className=" px-2 py-1 text-gray-700">{variant}</div>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-medium">Quantity:</label>
            <span className="text-lg font-medium">{quantity}</span>
          </div>
        </div>
        <div>
          <img
            src={image}
            alt={name}
            className="h-24 w-24 md:h-32 md:w-32 rounded-3xl object-cover ml-4"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-lg font-medium text-gray-700">Price: ₹{price}</div>
      </div>
    </div>
  );
};

export default MyOrderPizzaCard;

import React, { useState } from "react";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';

const MyOrderPizzaCard = ({
  name = "Pizza Name",
  price = 299,
  image,
  quantity,
  variant,
  category
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="flex flex-col border-4 border-hero rounded-3xl max-w-96 p-6 bg-white shadow-lg relative">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center gap-2">
          <div className="text-xl text-gray-800">{name}</div>
          <div className="flex items-center gap-2">
            <label className="font-medium">Category :</label>
            <div className=" px-2 py-1 text-gray-700">{category}</div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-medium">Variant:</label>
            <div className=" px-2 py-1 text-gray-700">{variant}</div>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-medium">Quantity:</label>
            <span className="text-lg font-medium">{quantity}</span>
          </div>
        </div>
        <div className="relative h-24 w-24 md:h-32 md:w-32 flex items-center justify-center">
          {imageLoading && (
            <Leapfrog
              size="40"
              speed="2.5"
              color="#FFA527"
            />
          )}
          <img
            src={image}
            alt={name}
            className={`h-full w-full rounded-3xl object-cover ml-4 ${imageLoading ? 'hidden' : 'block'}`}
            onLoad={() => setImageLoading(false)}
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

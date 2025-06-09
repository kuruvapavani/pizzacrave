import React from "react";
import PizzaCard from "../components/PizzaCard";

const Home = () => {
  const pizzaData = [
  {
    _id: '001',
    name: 'Margherita',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP0HbRY0SsECXq3XHqjXUBw3CqK1VfE5PX1w&s',
    price: {
      small: 8.99,
      medium: 10.99,
      large: 12.99,
    },
    variants: ['Small', 'Medium', 'Large'],
  },{
    _id: '002',
    name: 'Margherita',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP0HbRY0SsECXq3XHqjXUBw3CqK1VfE5PX1w&s',
    price: {
      small: 8.99,
      medium: 10.99,
      large: 12.99,
    },
    variants: ['Small', 'Medium', 'Large'],
  },{
    _id: '003',
    name: 'Margherita',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP0HbRY0SsECXq3XHqjXUBw3CqK1VfE5PX1w&s',
    price: {
      small: 8.99,
      medium: 10.99,
      large: 12.99,
    },
    variants: ['Small', 'Medium', 'Large'],
  },{
    _id: '004',
    name: 'Margherita',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP0HbRY0SsECXq3XHqjXUBw3CqK1VfE5PX1w&s',
    price: {
      small: 8.99,
      medium: 10.99,
      large: 12.99,
    },
    variants: ['Small', 'Medium', 'Large'],
  },{
    _id: '005',
    name: 'Margherita',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP0HbRY0SsECXq3XHqjXUBw3CqK1VfE5PX1w&s',
    price: {
      small: 8.99,
      medium: 10.99,
      large: 12.99,
    },
    variants: ['Small', 'Medium', 'Large'],
  },
];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {pizzaData.length > 0 ? (
        pizzaData.map((pizza) => <PizzaCard key={pizza._id} pizza={pizza} />)
      ) : (
        <div className="text-center col-span-full">
          No pizzas found for this category
        </div>
      )}
    </div>
  );
};

export default Home;

import React,{useState} from "react";
import { Link } from "react-router-dom";
import pizzaImg from "../assets/errorImg.png";

const ErrorPage = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 text-center">
      <div className="flex items-center text-8xl font-bold text-hero">
        <span>4</span>

        {imgError ? (
          <span className="mx-2">0</span>
        ) : (
          <img
            src={pizzaImg}
            alt="Pizza"
            className="w-20 h-20 sm:w-24 sm:h-24 mx-2 animate-spin-slow" // or animate-bounce
            onError={() => setImgError(true)}
          />
        )}

        <span>4</span>
      </div>

      <h1 className="mt-6 text-3xl font-semibold text-hero">
        Oops! Page Not Found
      </h1>
      <p className="mt-2 text-gray-600 max-w-md">
        Looks like this page got lost in the oven. Let’s go back and grab a slice!
      </p>

      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 bg-hero text-white rounded-full shadow hover:bg-opacity-90 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;


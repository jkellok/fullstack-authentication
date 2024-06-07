import React from "react";
import unp from "../assets/unp.jpg";
import { Link } from "react-router-dom";

const Analytics = () => {
  return (
    <div className="company w-full bg-white py-16 px-4">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-2">
        <img className="w-[350px] mx-auto my-4" src={unp} alt="/" />
        <div className="flex flex-col justify-center">
          <p className="text-[#00df9a] font-bold ">
            Join the community and start hiring the best candidates
          </p>
          <h1 className="md:text-4xl text-[#1e1f1f] sm:text-3xl text-2xl font-bold py-2">
            Access the largest university network{" "}
          </h1>
          <p className="text-[#1e1f1f]">
            <li>Digitalize and easily grow your university relations</li>
          </p>
          <p className="text-[#1e1f1f]">
            <li>Engage directly with students</li>
          </p>
          <Link to={"/login/supabase"}>
          <button className="bg-[#00df9a] w-[200px] text-bold hover:bg-[#00B27B] rounded-md font-medium my-6 mx-auto py-3 text-black">
            Get Started
          </button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

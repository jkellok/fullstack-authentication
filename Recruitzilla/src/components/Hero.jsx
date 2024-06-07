import { useRef } from "react";
// import Typed from 'react-typed';
import video from "../assets/j.mp4";
import { Link } from "react-router-dom";

const HeroVideo = () => {
  return (
    <div className="hero-video">
      {/* <video src={video} autoPlay loop muted /> */}
      <img src="/enhance.jpg" alt="image" />
    </div>
  );
};
const Hero = () => {
  return (
    <div className="home text-white">
      <HeroVideo />

      <div className="max-w-[800px]  mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <p className=" gradient-text text-[#00df9a] md:text-2xl sm:text-l text-xl font-bold p-2">
          TAMK Student Catalogue
        </p>
        <h1 className=" gradient-text md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
          Bridging companies with fresh talents{" "}
        </h1>

        <p className="md:text-[#ecffe8] text-xl font-bold text-gray-500">
          Easily recruit the best students and young graduates
        </p>
        <Link to={"/login/supabase"}>
          <button className="bg-[#00df9a] w-[200px] text-bold hover:bg-[#00B27B] rounded-md font-medium my-6 mx-auto py-3 text-black">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;

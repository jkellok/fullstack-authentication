import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link as ScrollLink, Element } from "react-scroll";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import * as Scroll from "react-scroll";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const path = useLocation().pathname;
  const location = path.split("/")[1];
  const navigate = useNavigate();
  const scroller = Scroll.scroller;
  const {
    session,
    role,
    logout
  } = useAuth();

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setNavVisible(lastScrollTop > currentScrollTop || currentScrollTop <= 0);
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && nav) {
        setNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [nav]);

  const goToPageAndScroll = async (selector) => {
    await navigate("/");
    await scroller.scrollTo(selector, {
      duration: 500,
      smooth: true,
      offset: -75,
      spy: true,
    });
  };

  const goToPageByRole = async () => {
    switch(role) {
      case "student":
        await navigate("/student-console")
        break;
      case "recruiter":
        await navigate("/app/filter")
        break;
      case "admin":
        await navigate("admin-console")
        break;
      default:
        await navigate("/login/supabase")
    }
  }

  return (
    <>
      <div
        className={`fixed-navbar flex justify-between items-center h-24 w-full text-white ${
          navVisible ? "" : "hidden-navbar"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 w-full flex justify-between items-center">
          <nav className="flex justify-between items-center w-full">
            <Link to="/">
              <button>
                <h1 className="text-3xl font-bold text-[#00df9a]">
                  RECRUIT ZILLA.
                </h1>
              </button>
            </Link>
            {location === "" ? (
              <ul className="hidden md:flex">
                <ScrollLink to="home" spy={true} smooth={true}>
                  <button className="p-4 text-bold hover:bg-[#323236] rounded-md">
                    Home
                  </button>
                </ScrollLink>
                <ScrollLink to="company" spy={true} smooth={true}>
                  <button className="p-4 text-bold hover:bg-[#323236] rounded-md">
                    Company
                  </button>
                </ScrollLink>
                <ScrollLink to="contact" spy={true} smooth={true}>
                  <button className="p-4 text-bold hover:bg-[#323236] rounded-md">
                    Contact
                  </button>
                </ScrollLink>
                {session ? (
                  <>
                    <button
                      onClick={() => goToPageByRole()}
                      className="p-4 text-bold hover:bg-[#323236] rounded-md"
                    >
                      My Console
                    </button>
                    <button
                      onClick={() => navigate("/usermanagement")}
                      className="p-4 text-bold hover:bg-[#323236] rounded-md"
                    >
                      Settings
                    </button>
                    <NavLink to="/" spy={true} smooth={true}>
                      <button
                        className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-[95px] h-[50px] text-bold hover:bg-[#00B27B] rounded-md font-small py-4 text-black"
                        onClick={logout}
                        >
                        Logout
                      </button>
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/login/supabase" spy={true} smooth={true}>
                    <button className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-[95px] h-[50px] text-bold hover:bg-[#00B27B] rounded-md font-small py-4 text-black">
                      Login
                    </button>
                  </NavLink>
                )}
              </ul>
            ) : (
              <ul className="hidden md:flex">
                <button
                  onClick={() => goToPageAndScroll("home")}
                  className="p-4 text-bold hover:bg-[#323236] rounded-md"
                >
                  Home
                </button>
                <button
                  onClick={() => goToPageAndScroll("company")}
                  className="p-4 text-bold hover:bg-[#323236] rounded-md"
                >
                  Company
                </button>
                <button
                  onClick={() => goToPageAndScroll("contact")}
                  className="p-4 text-bold hover:bg-[#323236] rounded-md"
                >
                  Contact
                </button>
                {session ? (
                  <>
                    <button
                      onClick={() => goToPageByRole()}
                      className="p-4 text-bold hover:bg-[#323236] rounded-md"
                    >
                      My Console
                    </button>
                    <button
                      onClick={() => navigate("/usermanagement")}
                      className="p-4 text-bold hover:bg-[#323236] rounded-md"
                    >
                      Settings
                    </button>
                    <NavLink to="/" spy={true} smooth={true}>
                      <button
                        className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-[95px] h-[50px] text-bold hover:bg-[#00B27B] rounded-md font-small py-4 text-black"
                        onClick={logout}
                        >
                        Logout
                      </button>
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/login/supabase" spy={true} smooth={true}>
                    <button className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-[95px] h-[50px] text-bold hover:bg-[#00B27B] rounded-md font-small py-4 text-black">
                      Login
                    </button>
                  </NavLink>
                )}
              </ul>
            )}
          </nav>

          <div onClick={handleNav} className="block md:hidden">
            {nav ? <AiOutlineClose size={35} /> : <AiOutlineMenu size={35} />}
          </div>
          <ul
            className={
              nav
                ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
                : "ease-in-out duration-500 fixed left-[-100%]"
            }
          >
            <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
              RECRUIT ZILLA.
            </h1>
            <ul>
              <ScrollLink to="home" spy={true} smooth={true}>
                <li className="p-4 border-b border-gray-600">
                  <button>Home</button>
                </li>
              </ScrollLink>
              <ScrollLink to="company" spy={true} smooth={true}>
                <li className="p-4 border-b border-gray-600">
                  <button>Company</button>
                </li>
              </ScrollLink>
              <ScrollLink to="contact" spy={true} smooth={true}>
                <li className="p-4 border-b border-gray-600">
                  <button>Contact</button>
                </li>
              </ScrollLink>
              {session ? (
                <li className="p-4 border-b border-gray-600">
                  <button
                    onClick={() => goToPageByRole()}
                    className="p-4 text-bold hover:bg-[#323236] rounded-md"
                  >
                    My Console
                  </button>
                  <button
                    onClick={() => navigate("/usermanagement")}
                    className="p-4 text-bold hover:bg-[#323236] rounded-md"
                  >
                    Settings
                  </button>
                  <NavLink to="/" spy={true} smooth={true}>
                    <button
                      className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-[95px] h-[50px] text-bold hover:bg-[#00B27B] rounded-md font-small py-4 text-black"
                      onClick={logout}
                      >
                      Logout
                    </button>
                  </NavLink>
                </li>
              ) : (
                <li className="p-4 border-b border-gray-600">
                  <NavLink to="/login/supabase" spy={true} smooth={true}>
                    <button className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-full text-bold hover:bg-[#00B27B] rounded-md font-small py-4 text-black">
                      Login
                    </button>
                  </NavLink>
                </li>
              )}
            </ul>
          </ul>
        </div>
      </div>
      <div className="navbar-placeholder h-24"></div>{" "}
      {/* Placeholder Element */}
    </>
  );
};

export default Navbar;

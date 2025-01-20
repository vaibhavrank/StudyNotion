import React, { useEffect, useState } from "react";
import { Link, matchPath,useLocation } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import {NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import {  categories } from "../../services/apis";
import {  IoIosArrowDropdownCircle } from "react-icons/io";

// const subLinks = [
//     {
//         title:"python",
//         link:"/catalog/python",
//     },
//     {
//         title:"Web Development",
//         link: "/catalog/webdevelopment"
//     },
// ]
const Navbar = ()=>{


    const {token}  = useSelector( (state) => state.auth );
    const {user } = useSelector( (state ) =>state.profile);
    const {totalItems} = useSelector( (state)=> state.cart);
    const location = useLocation();

    const [subLinks, setSublinks] = useState([]);
    const fetchSublinks = async() =>{
        try{
            const result = await apiConnector("GET",categories.CATEGORIES_API);
            setSublinks(result.data.allCatagory);
        }catch(error){
            console.log("could not fetch the category details");
        }
    }
    useEffect( ()=>{
            fetchSublinks();
    },[]);

    const matchRoute = (route) =>{
        return matchPath({path:route},location.pathname);
    }
    return (
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
            <div className="flex items-center justify-around w-11/12 max-w-maxContent">
                <Link to="/"  >
                    <img src={logo} width={160} height={42} loading="lazy" />
                </Link>

                {/**Nav Links  */}
                <nav>
                    <ul className="flex gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map((link,index) =>{
                                return (
                                    <li key={index}>
                                        {
                                            link.title == "Catalog" ? (
                                                <div className="relative flex items-center justify-center gap-2 group ">
                                                    <p>{link.title}</p>
                                                    <IoIosArrowDropdownCircle />
                                                    <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex 
                                                    w-[200px] translate-x-[-50%] translate-y-[3em] flex-col gap-2 rounded-lg 
                                                    bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all 
                                                    duration-120 group-hover:visible group-hover:translate-y-[1.65em] 
                                                    group-hover:opacity-100 lg:w-[300px]'>
                                                        <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] 
                                                        rotate-45 select-none rounded bg-richblack-5'></div>
                                                        {
                                                            subLinks ? (
                                                                
                                                                    subLinks.map((subLink,index ) =>(
                                                                        
                                                                            <Link className=" z-50  px-1 text-1xl font-semibold " to={`/catalog/${subLink.name}`} key={index}>
                                                                                <p>{subLink.name}</p>
                                                                            </Link>
                                                                        )
                                                                    )
                                                                
                                                            ) : (<div></div>)
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            ) : (
                                                <Link to={link.path} className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                    <p>{link.title}</p>
                                                </Link>
                                            )
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>

                {/**Login/SignUp Dshbard */}
                <div className="flex items-center gap-x-4">
                    {
                        user &&user?.accountType != "Instructor" && (
                            <Link to={"/dashboard/cart/" } className="">
                                <AiOutlineShoppingCart />
                                {
                                    totalItems > 0 && (
                                        <span>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token===null && (
                            <Link to={"/login"} >
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                                text-richblack-100 rounded-md ">
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token===null && (
                            <Link to={"/signup"} >
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                                text-richblack-100 rounded-md ">
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }
                    {
                        (
                            
                                    token!=null && <ProfileDropDown />
                                
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default Navbar;
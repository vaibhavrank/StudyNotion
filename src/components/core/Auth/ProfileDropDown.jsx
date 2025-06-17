import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user){
    console.log("no user");
    return localStorage.setItem("token",null)
  } 

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-x-1"
      >
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="w-[30px] aspect-square rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-md text-richblack-100" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 top-[115%] z-[1000] w-40 min-w-max rounded-md border border-richblack-700 bg-richblack-800 text-sm divide-y divide-richblack-700 shadow-lg"
        >
          <Link
            to="/dashboard/my-profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <div className="flex items-center gap-x-2">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>

          <button
            onClick={() => {
              dispatch(logout(navigate));
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              Logout
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
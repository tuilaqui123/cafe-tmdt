"use client"
import Link from "next/link";
import { useEffect, useState, useRef, useContext } from "react";
import { usePathname } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { AppContext } from "@/context/AppContext";

const navList = [
  {
    name: "Home",
    href: "/home",
    id: 0,
  },
  {
    name: "Menu",
    href: "/menu",
    id: 1,
  },
  {
    name: "About us",
    href: "/about",
    id: 2,
  },
];

const CartBadge = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full transition-all duration-300 transform scale-100 hover:scale-110 px-1">
      {count > 99 ? '99+' : count}
    </span>
  )
}

const Navbar = () => {
  const { categories, cart, cartNoLog } = useContext(AppContext)
  const [selectNav, setSelectNav] = useState(null)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    const currentPath = pathname.split('/')[1]
    const currentNav = navList.find(nav => nav.href.includes(currentPath))
    if (currentNav) {
      setSelectNav(currentNav.id)
    } else {
      setSelectNav(null)
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.token) {
      setUser(JSON.parse(localStorage.user))
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.reload()
  }

  const isActive = (path) => {
    const currentPath = pathname.split('/')[1]
    return path.includes(currentPath)
  }

  const getTotalItems = () => {
    if (cart && cart.items?.length > 0) {
      return cart.items.reduce((total, item) => total + item.quantity, 0)
    } else if (cartNoLog && cartNoLog.items?.length > 0) {
      return cartNoLog.items.reduce((total, item) => total + item.quantity, 0)
    }
    return 0
  }

  return (
    <header className="backdrop-blur-lg border border-white/10 shadow-lg fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold text-[#4c2113]">
          <Link href="/">
            <p>Logo</p>
          </Link>
        </div>
        <ul className="flex space-x-6 text-[#4c2113] font-extralight">
          {navList.map((value) => (
            <li key={value.id}>
              {value.name === "Menu" ? (
                <div className="relative group" ref={dropdownRef}>
                  <button
                    className={`flex items-center hover:text-white hover:bg-[#A0522D] transition-all duration-300 ease-in-out px-3 py-2 rounded-md ${(selectNav === value.id || isActive(value.href))? "bg-[#A0522D] text-white" : ""}`}
                  >
                    {value.name}
                    <IoIosArrowDown className="ml-1 transform transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="py-1">
                      <Link href="/menu">
                        <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#A0522D] hover:text-white transition-colors duration-200">
                          All Products
                        </p>
                      </Link>
                      {categories.map((category) => (
                        <Link 
                          key={category._id} 
                          href={`/menu/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setSelectNav(value.id)}
                        >
                          <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#A0522D] hover:text-white transition-colors duration-200">
                            {category.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={value.href}>
                  <p
                    className={`hover:text-white hover:bg-[#A0522D] transition-all duration-300 ease-in-out px-3 py-2 rounded-md ${(selectNav === value.id || isActive(value.href)) ? "bg-[#A0522D] text-white" : ""}`}
                    onClick={() => setSelectNav(value.id)}
                  >
                    {value.name}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>
        {user ? (
          <div className="flex items-center gap-4 px-4 py-2 bg-[#A0522D] text-white rounded-md shadow-lg">
            <span className="text-base font-medium cursor-pointer">
              {JSON.parse(localStorage.user).name}
            </span>
            <div className="cursor-pointer"
                onClick={handleLogout}
            >
              <MdLogout className="text-2xl" />
            </div>
            <Link href="/cart" className="relative">
              <FaCartShopping 
                className="text-2xl hover:text-gray-200 transition-colors" 
                onClick={() => setSelectNav(3)}
              /> 
              <CartBadge count={getTotalItems()} />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="relative flex px-6 py-2 rounded-md items-center justify-center overflow-hidden bg-gray-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-orange-600 before:duration-500 before:ease-out hover:shadow-orange-600 hover:before:h-56 hover:before:w-56">
              <Link href="/login">
                <span className="relative z-10">Login</span>
              </Link>
            </button>
            <Link href="/cart" className="relative">
              <FaCartShopping 
                className="text-2xl text-black hover:text-[#A0522D] transition-colors" 
                onClick={() => setSelectNav(navList.length)}
              /> 
              <CartBadge count={getTotalItems()} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar;
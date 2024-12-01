"use client"
import Link from "next/link";
import { useEffect, useState, useRef, useContext } from "react";
import { usePathname } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { AppContext } from "@/context/AppContext";
import icon from "@/public/logo_shop.svg"
import Image from "next/image";

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
  if (count <= 0) return null
  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full transition-all duration-300 transform scale-100 hover:scale-110 px-1">
      {count > 99 ? '99+' : count}
    </span>
  )
}

const Navbar = () => {
  const { categories, cart, cartNoLog, getCartByUserId, getCartById } = useContext(AppContext)
  const [selectNav, setSelectNav] = useState(null)
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
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

  useEffect(() => {
    const updateCartCount = () => {
      if (cart && cart.items?.length > 0) {
        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(total)
      } else if (cartNoLog && cartNoLog.items?.length > 0) {
        const total = cartNoLog.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(total)
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()
  }, [cart, cartNoLog])

  useEffect(() => {
    const loadCartData = async () => {
      if (localStorage.user) {
        await getCartByUserId()
      } else if (localStorage.cartId) {
        await getCartById(localStorage.cartId)
      }
    }
    loadCartData()
  }, [])

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

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert('Tìm kiếm với từ khóa: ' + searchTerm);
  };

  return (
    <header className="backdrop-blur-lg border border-white/10 shadow-lg fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold text-[#4c2113]">
          <Link href="/">
            <img
              src="/logo_shop.svg"
              className="hover:scale-150 transition-transform duration-300 ease-in-out"
              alt="Logo"
              width={100}
              height={100}
            />
          </Link>
        </div>

        {/* <div className="flex justify-center items-center mt-8">
          <form onSubmit={handleSearchSubmit} className="flex items-center border-2 border-gray-300 rounded-full p-2 w-96">
            <input
              type="text"
              className="flex-1 px-4 py-2 text-lg rounded-l-full focus:outline-none"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-r-full hover:bg-red-400 transition-colors"
            >
              🔍
            </button>
          </form>
        </div> */}

        <ul className="flex space-x-6 text-[#4c2113] font-extralight">
          {navList.map((value) => (
            <li key={value.id}>
              {value.name === "Menu" ? (
                <div className="relative group" ref={dropdownRef}>
                  <button
                    className={`flex items-center hover:text-white hover:bg-[#A0522D] transition-all duration-300 ease-in-out px-3 py-2 rounded-md ${(selectNav === value.id || isActive(value.href)) ? "bg-[#A0522D] text-white" : ""}`}
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
                          <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#A0522D] hover:text-white transition-colors duration-200 capitalize">
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
            <Link className="flex items-center hover:cursor-pointer"
              href="/home"
            >
              <FaUser />

              <span className="text-base font-medium ml-2">
                {JSON.parse(localStorage.user).name}
              </span>
            </Link>

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
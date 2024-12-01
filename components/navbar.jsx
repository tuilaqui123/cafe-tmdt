"use client"
import Link from "next/link";
import { useEffect, useState, useRef, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { AppContext } from "@/context/AppContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import { RiBillFill } from "react-icons/ri";

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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/menu/search?keyword=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <header className="backdrop-blur-lg border border-white/10 shadow-lg fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between md:gap-8">
          <div className="flex-shrink-0">
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

          <button
            className="lg:hidden text-[#4c2113] p-2 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <RxHamburgerMenu className="text-2xl" />
          </button>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            <ul className="flex items-center space-x-6 text-[#4c2113] font-extralight">
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
              <li className="w-64">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-full border-2 border-[#A0522D] focus:outline-none focus:border-[#4c2113] transition-colors"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#A0522D] text-white p-2 rounded-full hover:bg-[#4c2113] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </li>
            </ul>

            {user ? (
              <div className="flex items-center gap-4 px-4 py-2 bg-[#A0522D] text-white rounded-md shadow-lg">
                <div className="relative group">
                  <button className="flex items-center hover:cursor-pointer">
                    <FaUser />
                    <span className="text-base font-medium ml-2">
                      {JSON.parse(localStorage.user).name}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="py-1">
                      <Link href="/user">
                        <p className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#A0522D] hover:text-white transition-colors duration-200">
                          <FaUserCircle className="mr-3"/> 
                          <span>Personal Information</span>
                        </p>
                      </Link>
                      <Link href="/user/orders">
                        <p className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#A0522D] hover:text-white transition-colors duration-200">
                          <RiBillFill className="mr-3"/>
                          <span>Order Management</span> 
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>

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
          </div>
        </div>

        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
          <div className="flex flex-col space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-full border-2 border-[#A0522D] focus:outline-none focus:border-[#4c2113] transition-colors"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#A0522D] text-white p-2 rounded-full hover:bg-[#4c2113] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <ul className="flex flex-col space-y-2">
              {navList.map((value) => (
                <li key={value.id}>
                  {value.name === "Menu" ? (
                    <div className="relative">
                      <Link href="/menu">
                        <p
                          className={`block w-full px-3 py-2 rounded-md transition-colors duration-200
                              ${selectNav === value.id ? "bg-[#A0522D] text-white" : "text-[#4c2113] hover:bg-[#A0522D] hover:text-white"}`}
                          onClick={() => {
                            setSelectNav(value.id);
                            setIsMenuOpen(false);
                          }}
                        >
                          {value.name}
                        </p>
                      </Link>
                    </div>
                  ) : (
                    <Link href={value.href}>
                      <p
                        className={`block w-full px-3 py-2 rounded-md transition-colors duration-200
                          ${selectNav === value.id ? "bg-[#A0522D] text-white" : "text-[#4c2113] hover:bg-[#A0522D] hover:text-white"}`}
                        onClick={() => {
                          setSelectNav(value.id)
                          setIsMenuOpen(false)
                        }}
                      >
                        {value.name}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/user" 
                    className="flex items-center px-3 py-2 rounded-md hover:bg-[#A0522D] hover:text-white transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    <span>{JSON.parse(localStorage.user).name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center px-3 py-2 rounded-md hover:bg-[#A0522D] hover:text-white transition-colors duration-200"
                  >
                    <MdLogout className="mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-center rounded-md bg-[#A0522D] text-white hover:bg-[#8B4513] transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              <Link
                href="/cart"
                className="flex items-center mt-2 px-3 py-2 rounded-md hover:bg-[#A0522D] hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative">
                  <FaCartShopping className="text-xl" />
                  <CartBadge count={getTotalItems()} />
                </div>
                <span className="ml-3">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
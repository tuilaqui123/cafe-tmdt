"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";

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

const Navbar = () => {
  const [selectNav, setSelectNav] = useState(null)
  const [user, setUser] = useState(null)
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
              <Link href={value.href}>
                <p className={`hover:text-white hover:bg-[#A0522D] transition-all duration-300 ease-in-out px-3 py-2 rounded-md ${(selectNav===value.id || isActive(value.href)) ? "bg-[#A0522D] text-white" : ""}`}
                    onClick={() => setSelectNav(value.id)}>{value.name}</p>
              </Link>
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
              <MdLogout />
            </div>
            <Link href="/cart">
              <FaCartShopping onClick={() => setSelectNav(3)}/> 
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="relative flex px-6 py-2 rounded-md items-center justify-center overflow-hidden bg-gray-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-orange-600 before:duration-500 before:ease-out hover:shadow-orange-600 hover:before:h-56 hover:before:w-56">
              <Link href="/login">
                <span className="relative z-10">Login</span>
              </Link>
            </button>
            <Link href="/cart">
              <FaCartShopping className="text-black" onClick={() => setSelectNav(3)}/> 
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

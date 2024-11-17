// components/Navbar.js
import Link from "next/link";

const navList = [
  {
    name: "Dashboard",
    href: "/dashboard",
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
  return (
    <header className="backdrop-blur-lg border border-white/10 shadow-lg fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="text-xl font-bold text-[#4c2113]">
          <Link href="/">
            <p>Logo</p>
          </Link>
        </div>
        {/* Navigation Links */}
        <ul className="flex space-x-6 text-[#4c2113] font-extralight">
          {navList.map((value) => (
            <li key={value.id}>
              <Link href={value.href}>
                <p className="hover:text-gray-300">{value.name}</p>
              </Link>
            </li>
          ))}
        </ul>
        {/* Login Button */}
        <button className="relative flex px-6 py-2 rounded-md items-center justify-center overflow-hidden bg-gray-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-orange-600 before:duration-500 before:ease-out hover:shadow-orange-600 hover:before:h-56 hover:before:w-56">
          <span className="relative z-10">Login</span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;

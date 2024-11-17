import Link from "next/link";
import { TiPlus } from "react-icons/ti";
export default function CardItem1() {
  return (
    <div className="w-full bg-[#a45c23] rounded-lg shadow-xl">
      <div className="bg-[#dcb485] rounded-t-lg">
        <img
          src="/item.png"
          alt="Item Image"
          className="w-full aspect-square"
        />
      </div>
      <div className="p-5">
        <div>
          <Link href={"/menu/1"}>
            <p className="text-xl font-bold">Cà phê sữa đá</p>
          </Link>
          <p className="text-sm text-gray-200 py-2">
            Lorem Ipsum is simply dummy
          </p>
          <div>
            <p className="font-semibold text-lg"></p>
            {/* <p>$30.99</p> */}
            {/* <p>$24.99</p> */}
          </div>
        </div>
        <div className="flex flex-row gap-3 mt-4">
          <button className="text-[#4c2113] w-[80%] hover:before:bg-red relative rounded-md overflow-hidden  bg-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#4c2113] before:transition-all before:duration-500 hover:text-white hover:shadow-[#4c2113] hover:before:left-0 hover:before:w-full">
            <span className="relative z-10 font-bold">$23.99</span>
          </button>
          <button className="rounded-md w-[18%] aspect-square text-center bg-[#4c2113] flex items-center justify-center font-bold">
            <TiPlus size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

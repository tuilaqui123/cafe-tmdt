import Link from "next/link";
import { TiPlus } from "react-icons/ti";
import Image from "next/image";
export default function CardItem1({id, image, name, description, discount, type}) {
  const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE').format(number)
  }
  
  const formatNameProduct = (name) => name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')

  return (
    <div className="w-full bg-[#a45c23] rounded-lg shadow-xl">
      <div className="bg-[#dcb485] rounded-t-lg">
        <Image
          src={image}
          alt="Item Image"
          className="w-full aspect-square"
          width={300}
          height={300}
          priority={true}
        />
      </div>
      <div className="p-5">
        <div>
          <Link href={`/menu/${id}`}>
            <p className="text-xl font-bold">{formatNameProduct(name)}</p>
          </Link>
          <p className="text-sm text-gray-200 py-2 truncate">
            {description}
          </p>
          <div>
            <p className="font-semibold text-lg"></p>
            {/* <p>$30.99</p> */}
            {/* <p>$24.99</p> */}
          </div>
        </div>
        <div className="flex flex-row gap-3 mt-4">
          <button className="text-[#4c2113] w-[80%] hover:before:bg-red relative rounded-md overflow-hidden bg-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#4c2113] before:transition-all before:duration-500 hover:text-white hover:shadow-[#4c2113] hover:before:left-0 hover:before:w-full">
            <div className="flex items-center justify-center space-x-2">
              <span className="relative z-10 font-bold">
                {(discount > 0) ? formatNumber(type[0].price - (type[0].price*discount)/100) : formatNumber(type[0].price)}đ
              </span>
              {(discount > 0) ? <span className="relative z-10 font-bold line-through text-gray-500">{formatNumber(type[0].price)}đ</span> : null}
            </div>
          </button>
          <button className="rounded-md w-[18%] aspect-square text-center bg-[#4c2113] flex items-center justify-center font-bold">
            <TiPlus size={22} color="white"/>
          </button>
        </div>
      </div>
    </div>
  );
}

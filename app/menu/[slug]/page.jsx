"use client"
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { FcCancel } from "react-icons/fc";

export default function ItemView() {
  const params = useParams()
  const {product, getProductById} = useContext(AppContext)
  const [size, setSize] = useState()
  const [isClickIndex, setIsClickIndex] = useState(0)

  const formatNameProduct = (name) => name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE').format(number)
  }
  
  const handleClickSize = (size, price, index) => {
    setIsClickIndex(index)
  }

  const findPriceBySize = (size) => {
    return product.type.find(ele => ele.size === size)?.price || 0
  }

  const caculatePrice = (type) => {
    if (product.type.length === 1) return 0

    if (type.size === "L") return 0

    if (type.size === "M") {
      if (product.type.length === 2 && !product.type.some(ele => ele.size === "L")) return 0
      return type.price - findPriceBySize("L")
    }

    if (type.size === "S") {
      if (product.type.some(ele => ele.size === "L")) {
        return type.price - findPriceBySize("L")
      }
      return type.price - findPriceBySize("M")
    }

    return 0
  }

  useEffect(() => {
    getProductById(params.slug)
  }, [])

  return (
    <div>
      {(product._id===undefined) ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl inline-flex items-center text-red-500">
            Không có dữ liệu <FcCancel className="ml-2" />
          </p>
        </div>
      ) : (
        <div className="flex flex-row h-screen overflow-hidden border border-black">
          <div className="w-[40%] aspect-square border border-black p-10">
            <Image
              src={product.image}
              alt="Product Image"
              className="w-full border border-black"
              width={500}
              height={500}
            />
          </div>
          <div className="p-10 text-black w-[100%]">
            <div>
              <p className="font-bold text-3xl mb-2">{formatNameProduct(product.name)}</p>
              <div className="flex items-center space-x-2 text-[#4c2113] text-2xl font-bold mb-3">
                <span>
                  {(product.discount > 0) ? formatNumber(product.type[isClickIndex].price - (product.type[isClickIndex].price*product.discount)/100) : formatNumber(product.type[isClickIndex].price)}đ
                </span>
                {(product.discount > 0) ? <span className="relative z-10 font-bold line-through text-gray-500">{formatNumber(isClickIndex ? product.type[isClickIndex].price: product.type[0].price)}đ</span> : null}
              </div>
            </div>
            <div className="mb-2">Chọn size: </div>
            <div className="flex gap-5 mb-5">
              {product.type.map((type, index) => {
                return (
                  <button key={index} className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 hover:shadow-md ${isClickIndex === index ? "bg-[#A45C23]" : "border-2 border-gray-300"}`}
                          onClick={() => handleClickSize(type.size, type.price, index)}>
                    <span className={`${isClickIndex === index ? "text-white" : "text-gray-600"} font-medium`}>
                      {(type.size==="S") ? "Nhỏ" : ((type.size==="M") ? "Vừa" : "Lớn")} <span className="font-semibold">{formatNumber(caculatePrice(type))}đ</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mb-4 w-[70%]">
              <p className="font-bold text-xl mb-2">Mô tả sản phẩm</p>
              <p className="text-gray-600 break-words">
                {product.description} 
              </p>
            </div>
            <button className="flex items-center w-[70%] justify-center relative rounded-md overflow-hidden gap-2 bg-[#4c2113] text-white font-semibold px-6 py-3 shadow-md transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#ae4f2f] hover:text-black before:transition-all before:duration-500 hover:shadow-[#4c2113] hover:before:left-0 hover:before:w-full">
              <span className="relative z-10">Đặt hàng</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

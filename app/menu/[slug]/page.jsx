"use client"
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { FcCancel } from "react-icons/fc";

export default function ItemView() {
  const params = useParams()
  const size = useState()
  const {product, setProduct, getProductById} = useContext(AppContext)

  const formatNameProduct = (name) => name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE').format(number)
  }
  
  const handleClickSize = () => {
    
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
                  {(product.discount > 0) ? formatNumber(product.type[0].price - (product.type[0].price*product.discount)/100) : formatNumber(product.type[0].price)}đ
                </span>
                {(product.discount > 0) ? <span className="relative z-10 font-bold line-through text-gray-500">{formatNumber(product.type[0].price)}đ</span> : null}
              </div>
            </div>
            <div className="mb-2">Chọn size: </div>
            <div className="flex gap-5 mb-5">
              {product.type.map((type, index) => {
                return (
                  <button key={index} className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:shadow-md"
                        onClick={() => handleClickSize(type.size, type.price)}>
                    <span className="text-gray-600 font-medium">
                      {(type.size==="L") ? "Nhỏ" : ((type.size==="M") ? "Vừa" : "Lớn")} + <span className="font-semibold">{(type.size==="L") ? 0 : ((type.size==="M") ? formatNumber(product.type[1].price - product.type[0].price)  : formatNumber(product.type[2].price - product.type[0].price))} đ</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mb-4 w-[70%]">
              <p className="font-bold text-xl mb-2">Mô tả sản phẩm</p>
              <p className="text-gray-600">
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

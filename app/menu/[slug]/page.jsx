"use client"
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { FcCancel } from "react-icons/fc";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";
import RelatedProductCard from "@/components/relatedProductCard";

export default function ItemView() {
  const params = useParams()
  const router = useRouter();
  const {product, getProductById, products, addItemToCart, addItemToCartNoLog, getCartByUserId, getCartById} = useContext(AppContext)
  const [size, setSize] = useState("S")
  const [isClickIndex, setIsClickIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [relatedProducts, setRelatedProducts] = useState([])

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: () => {
        (localStorage.user) ? getCartByUserId() : getCartById(localStorage?.cartId)
      }
    })
  }

  const formatNameProduct = (name) => name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE').format(number)
  }
  
  const handleClickSize = (size, price, index) => {
    setSize(size)
    setIsClickIndex(index)
  }

  const findPriceBySize = (size) => {
    return product.type.find(ele => ele.size === size)?.price || 0
  }

  const caculatePrice = (type) => {
    if (product.type.length === 1) return 0

    if (type.size === "S") return 0

    if (type.size === "M") {
      if (product.type.length === 2 && !product.type.some(ele => ele.size === "S")) return 0
      return type.price - findPriceBySize("S")
    }

    if (type.size === "L") {
      if (product.type.some(ele => ele.size === "S")) {
        return type.price - findPriceBySize("S")
      }
      return type.price - findPriceBySize("M")
    }

    return 0
  }

  const handleAddItem = async (id, size) => {
    console.log(12345)
    if (localStorage.user) {
      await addItemToCart(id, size, "", 1)
      notifySuccess("Thêm vào giỏ hàng thành công")
    } else {
      if (localStorage.cartId) {
        await addItemToCartNoLog(localStorage.cartId, id, size, "", 1)
        notifySuccess("Thêm vào giỏ hàng thành công")
      } else {
        const cartId = await addNewCart()
        localStorage.setItem('cartId', cartId)

        await addItemToCartNoLog(localStorage.cartId, id, size, "", 1)
        notifySuccess("Thêm vào giỏ hàng thành công")
      }
    }
  }

  const handleMouseMove = (e) => {
    if (!isZoomed) return
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setMousePosition({ x, y })
  }

  useEffect(() => {
    getProductById(params.slug)
  }, [])

  useEffect(() => {
    const getRelatedProducts = () => {
      if (product && product.categoryId) {
        const related = products.filter(p => (p.categoryId === product.categoryId || p.categoryId?._id === product.categoryId?._id) && p._id !== product._id && p.isStock).slice(0, 4)

        setRelatedProducts(related)
      }
    };

    if (product._id) {
      getRelatedProducts()
    }
  }, [product, products])


  return (
    <div className="w-full h-auto px-4 py-8 m-0">
      <ToastContainer/>
      {(product._id === undefined) ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl inline-flex items-center text-red-500">
            Không có dữ liệu <FcCancel className="ml-2" />
          </p>
        </div>
      ) : (
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row gap-0 w-full mb-16">
            <div className="md:w-1/2 aspect-square overflow-hidden">
              <div 
                className="relative h-full w-full bg-white cursor-zoom-in rounded-xl"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-200"
                  style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                  }}
                  priority
                />
              </div>
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
                {product.type
                  .sort((a, b) => {
                    const sizeOrder = { S: 1, M: 2, L: 3 }
                    return sizeOrder[a.size] - sizeOrder[b.size]
                  })
                  .map((type, index) => {
                    return (
                      <button 
                        key={index} 
                        className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 hover:shadow-md ${isClickIndex === index ? "bg-[#A45C23]" : "border-2 border-gray-300"}`}
                        onClick={() => handleClickSize(type.size, type.price, index)}
                      >
                        <span className={`${isClickIndex === index ? "text-white" : "text-gray-600"} font-medium`}>
                          {(type.size==="S") ? "Nhỏ" : ((type.size==="M") ? "Vừa" : "Lớn")} 
                          <span className="font-semibold">
                            &nbsp; + {formatNumber(caculatePrice(type))}đ
                          </span>
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
              <div className="flex gap-4 w-[70%]">
                <button className="flex-1 flex items-center justify-center relative rounded-md overflow-hidden bg-white border-2 border-[#4c2113] text-[#4c2113] font-semibold px-6 py-3 shadow-md hover:bg-[#4c2113] hover:text-white transition-all duration-300"
                      onClick={() => handleAddItem(product._id, size)}
                >
                  <span className="relative z-10">Thêm vào giỏ</span>
                </button>

                <button className="flex-1 flex items-center justify-center relative rounded-md overflow-hidden gap-2 bg-[#4c2113] text-white font-semibold px-6 py-3 shadow-md transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#ae4f2f] hover:text-black before:transition-all before:duration-500 hover:shadow-[#4c2113] hover:before:w-full">
                  <span className="relative z-10">Đặt hàng</span>
                </button>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-[#4c2113]">
                Các sản phẩm liên quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <RelatedProductCard
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
import Link from "next/link";
import { TiPlus, TiMinus, TiTimes } from "react-icons/ti";
import Image from "next/image";
import { AppContext } from "@/context/AppContext";
import { useContext, useState } from "react";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CardItem1({id, image, name, description, discount, type, handleImageClick}) {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const {addNewCart, addItemToCart, addItemToCartNoLog, getCartByUserId, getCartById, setObjCartForOne} = useContext(AppContext)

  const router = useRouter()

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
        setShowOptions(false)
      }
    })
  }

  const handleAddItem = async (id, size, note, quantity) => {
    if (localStorage.user) {
      await addItemToCart(id, size, note, quantity)
      notifySuccess("Thêm vào giỏ hàng thành công")
    } else {
      if (localStorage.cartId) {
        await addItemToCartNoLog(localStorage.cartId, id, size, note, quantity)
        notifySuccess("Thêm vào giỏ hàng thành công")
      } else {
        const cartId = await addNewCart()
        localStorage.setItem('cartId', cartId)

        await addItemToCartNoLog(localStorage.cartId, id, size, note, quantity)
        notifySuccess("Thêm vào giỏ hàng thành công")
      }
    }
  }

  const handleOrder = () => {
    let price
    const typeOrder = type.sort((a, b) => {
      const sizeOrder = { S: 1, M: 2, L: 3 }
      return sizeOrder[a.size] - sizeOrder[b.size]
    })
    setObjCartForOne({
      productId: id,
      name: name,
      quantity: 1,
      size: typeOrder[0].size,
      price: typeOrder[0].price,
      discount: discount,
      image: image
    })
    router.push('/checkout')  
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE').format(number)
  }
  
  const formatNameProduct = (name) => name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')

  const handleShowOptions = () => {
    setQuantity(1)
    setShowOptions(true)
    setTimeout(() => {
      setSelectedSize(type[0])
    }, 0)
  }

  const handleSizeChange = (e) => {
    const size = type.find((t) => t.size === e.target.value)
    setSelectedSize(size)
  }

  return (
    <div className="w-full bg-[#a45c23] rounded-lg shadow-xl">
      <ToastContainer />
      <div className="bg-[#dcb485] rounded-t-lg relative">
        <Link href={`/menu/${id}`}>
          <div className="cursor-pointer">
            <Image
              src={image}
              alt="Item Image"
              className="w-full aspect-square hover:opacity-90 transition-opacity"
              width={300}
              height={300}
              priority={true}
            />
          </div>
        </Link>
        <div
          className="absolute inset-0 cursor-zoom-in"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleImageClick(image)
          }}
        />
      </div>
      <div className="p-5">
        <div>
          <Link href={`/menu/${encodeURIComponent(name.split(" ").join("-"))}`}>
            <h3 className="text-xl font-bold text-white hover:text-gray-200 transition-colors min-h-[56px] cursor-pointer">
              {formatNameProduct(name)}
            </h3>
          </Link>
          <p className="text-sm text-gray-200 py-2 truncate">{description}</p>
        </div>
        <div className="flex flex-row gap-3 mt-4">
          <button className="text-[#4c2113] w-[80%] hover:before:bg-red relative rounded-md overflow-hidden bg-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#4c2113] before:transition-all before:duration-500 hover:text-white hover:shadow-[#4c2113] hover:before:left-0 hover:before:w-full"
                onClick={handleOrder}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="relative z-10 font-bold">
                {(discount > 0) ? formatNumber(type[type.length - 1].price - (type[type.length - 1].price*discount)/100) : formatNumber(type[type.length - 1].price)}đ
              </span>
              {(discount > 0) ? <span className="relative z-10 font-bold line-through text-gray-500">{formatNumber(type[type.length - 1].price)}đ</span> : null}
            </div>
          </button>
          <button className="rounded-md w-[18%] aspect-square text-center bg-[#4c2113] flex items-center justify-center font-bold">
            <TiPlus size={22} color="white" onClick={handleShowOptions}/>
          </button>
        </div>

        {showOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-[90%] max-w-md bg-white p-5 rounded-lg shadow-xl">
              <button
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 rounded-full p-2"
                onClick={() => setShowOptions(false)}
              >
                <TiTimes className="text-2xl"/>
              </button>

              <h2 className="text-lg font-bold text-center mb-4">Chọn Size và Số Lượng</h2>
              <div>
                <label className="text-sm font-semibold">Size:</label>
                <select
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={selectedSize?.size || ''}
                  onChange={handleSizeChange}
                >
                  {type.map((ele, index) => (
                    <option key={index} value={ele.size}>
                      {ele.size} - ({formatNumber(ele.price - (ele.price*discount)/100)}đ)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold">Quantity:</label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    className="px-3 py-2 bg-[#4c2113] text-white rounded-md hover:bg-[#A0522D]"
                    onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                  >
                    <TiMinus />
                  </button>
                  <input
                    type="number"
                    className="w-16 text-center p-2 border border-gray-300 rounded-md"
                    value={quantity}
                    min="1"
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  />
                  <button
                    className="px-3 py-2 bg-[#4c2113] text-white rounded-md hover:bg-[#A0522D]"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    <TiPlus />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold">Ghi chú:</label>
                <textarea
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-none"
                  rows="2"
                  placeholder="Thêm ghi chú cho món này..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button
                className="mt-6 w-full bg-[#4c2113] hover:bg-[#A0522D] text-white font-bold py-2 rounded-md transition-all duration-400 ease-in-out"
                onClick={() => selectedSize && handleAddItem(id, selectedSize.size, note, quantity)}
                disabled={!selectedSize}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

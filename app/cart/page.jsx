"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaArrowRightLong } from "react-icons/fa6";
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { FaTrashAlt, FaTicketAlt, FaShoppingCart } from "react-icons/fa";
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/navigation';

const Cart = () => {
    const {
        totalCart, totalCartNoLog, cart, cartNoLog, 
        getCartByUserId, getCartById, deleteItemFromCart, deleteItemFromCartNoLog, 
        vouchers, setVouchers, checkVoucher, 
        getIdByName, getTotalUsedVouchers, getvoucherById} = useContext(AppContext)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)
    // const [coupons, setCoupons] = useState(() => {
    //     const getVoucherById = async () => {
    //         if (vouchers.length===0) {
    //             return []
    //         } else {
    //             const voucher = await getvoucherById
    //             return ["1","2","3"]
    //         }
    //     }
    //     return getVoucherById()
    // })
    const [coupons, setCoupons] = useState([]);
    const [totalSavings, setTotalSavings] = useState(0)
    const [finalTotal, setFinalTotal] = useState(totalCart)
    const [currentCoupon, setCurrentCoupon] = useState('')

    const router = useRouter()

    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number)
    }

    useEffect(() => {
        const fetchCoupons = async () => {
          if (vouchers.length === 0) {
            setCoupons([])
            return
          }
    
          const couponNames = await Promise.all(
            vouchers.map(async (voucherId) => {
              const voucherData = await getvoucherById(voucherId)
              console.log(voucherData)
              return voucherData.name
            })
          )

          console.log(couponNames)
    
          setCoupons(couponNames)
        }
    
        fetchCoupons()
      }, [vouchers, getvoucherById])

    const notifyError = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

    console.log(coupons)

    const stateOrder = [
        { id: 1, name: "Shopping Cart" },
        { id: 2, name: "Payment & Delivery Options" },
        { id: 3, name: "Order Received" },
    ]

    const handleDeleteClick = (productId, size) => {
        setItemToDelete({ productId, size })
        setShowConfirmModal(true)
    }

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return

        const res = (localStorage.user) 
            ? await deleteItemFromCart(itemToDelete.productId, itemToDelete.size) 
            : await deleteItemFromCartNoLog(itemToDelete.productId, itemToDelete.size)

        if (res.success === false) {
            notifyError(res.message)
        } else {
            toast.success("Xóa sản phẩm thành công", {
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
            });
        }
        setShowConfirmModal(false)
        setItemToDelete(null)
    }

    const handleCheckVoucher = async () => {
        if (currentCoupon == "") {
            toast.warn("Hãy nhập mã voucher", {
                position: "top-right",
                autoClose: 700,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        }

        const resVoucherId = await getIdByName(currentCoupon)
        if (resVoucherId.success==false) {
            notifyError("Mã voucher không đúng")
            return
        }
        const isValidVoucher = await checkVoucher(resVoucherId)
        if (isValidVoucher.success==false) {
            notifyError(isValidVoucher.message)
            return
        }

        if (currentCoupon.trim()) {
            setVouchers([...vouchers, resVoucherId[0]])
            setCoupons([...coupons, currentCoupon])
            setCurrentCoupon('')
        }
    }

    const handleRemoveCoupon = (index) => {
        const newVouchers = vouchers.filter((_, i) => i !== index)
        const newCoupons = coupons.filter((_, i) => i !== index)
        
        setVouchers(newVouchers)
        setCoupons(newCoupons)
    }

    const handleCheckout = () => {
        if ((finalTotal < 0.5*totalCart) || (finalTotal < 0.5*totalCartNoLog)) {
            notifyError("Không thể áp dụng mã lớn hơn phân nửa giá trị đơn hàng")
        } else {
            router.push("/checkout")
        }
    }

    useEffect(() => {
        if (localStorage.user) {
            getCartByUserId()
        } else {
            getCartById(localStorage?.cartId)
        }
    }, [cart.items?.length])

    useEffect(() => {
        const updateTotalSavings = async () => {
            if (vouchers.length > 0) {
                const totalRes = await getTotalUsedVouchers(vouchers, totalCart)
                setTotalSavings(totalCart - totalRes.total)
                setFinalTotal(totalRes.total)
            } else {
                setTotalSavings(0)
                setFinalTotal(totalCart || totalCartNoLog)
            }
        };
        updateTotalSavings()
    }, [vouchers, totalCart, totalCartNoLog])

    useEffect(() => {
        if (totalSavings > 0) {
            setFinalTotal((totalCart || totalCartNoLog) - totalSavings)
        } else {
            setFinalTotal(totalCart || totalCartNoLog)
        }
    }, [totalCart, totalCartNoLog, totalSavings])

    useEffect(() => {
        console.log()
    }, [])

    return (
        <div className="mx-auto rounded-lg w-[90%]">
            <ToastContainer />
            {(cart.items?.length!==0 && cartNoLog.items?.length!==0) ? (
                <div>
                    <div className='flex gap-3 justify-center cursor-pointer mb-8'>
                        {stateOrder.map((ele, index) => {
                            return (
                                <div key={index} className='flex items-center gap-2'>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-10 h-10 bg-[#A0522D] text-white rounded-full font-bold transition-all duration-400 ease-in-out">
                                            {ele.id}
                                        </div>
                                        <span className="text-black">{ele.name}</span>
                                    </div>
                                    {ele.id!==3 ? <FaArrowRightLong /> : null}
                                </div>
                            )
                        })}
                    </div>

                    <table className="w-full table-auto border-collapse mb-6">
                        <thead>
                            <tr className="text-left border-b border-gray-200 bg-[#A0522D] rounded-tl-[5px] rounded-bl-[5px] text-white">
                                <th className="p-2">Product</th>
                                <th className="p-2">Size</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2">Subtotal</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {(() => {
                            let itemsToRender = []
                            if (cart && cart.items?.length > 0) {
                                itemsToRender = cart.items
                            } else if (cartNoLog && cartNoLog.items?.length > 0) {
                                itemsToRender = cartNoLog.items
                            }

                            return itemsToRender.map((item, index) => (
                                <tr key={index} className="border-b border-black text-black hover:text-[#A0522D] cursor-pointer">
                                    <td className="p-2 flex items-center">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-20 h-20 mr-3"
                                            width={500}
                                            height={300}
                                            priority
                                        />
                                            {item.product.name}
                                    </td>
                                    <td className="p-2">{item.size}</td>
                                    <td className="p-2">{formatNumber(item.price - (item.price*item.discount)/100)} đ</td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            className="w-16 border border-gray-300 p-1 rounded"
                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">{formatNumber((item.price - (item.price*item.discount)/100) * item.quantity)} đ</td>
                                    <td className="p-2">
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteClick(item.product._id, item.size)}
                                        >
                                            <FaTrashAlt className='text-xl' />
                                        </button>
                                    </td>
                                </tr>
                            ));
                        })()}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg shadow-sm">
                    <FaShoppingCart className="text-[#A0522D] text-6xl mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 text-center mb-6">Looks like you haven&apos;t added anything to your cart yet</p>
                    <Link href="/menu" className="px-6 py-3 bg-[#A0522D] text-white rounded-full hover:bg-[#8B4513] transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                onClick={handleConfirmDelete}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`flex ${(localStorage.user) ? "items-center justify-between" : "justify-end"}`}>   
                {(cart.items?.length!==0 && localStorage.user ) && (
                    <div className="w-[40%]">
                        <div className="flex items-center gap-3 p-2 border rounded-full shadow-md bg-white mb-4">
                            <FaTicketAlt className="text-gray-400 text-xl" />
                            <input
                                type="text"
                                value={currentCoupon}
                                onChange={(e) => setCurrentCoupon(e.target.value)}
                                placeholder="Coupon Code"
                                className="flex-1 border-none outline-none text-gray-500 placeholder-gray-400"
                            />
                            <div className="h-8 border-l border-gray-400"></div>
                            <button 
                                onClick={handleCheckVoucher}
                                className="px-4 py-2 bg-white text-gray-600 font-medium rounded-lg hover:text-[#A0522D] transition cursor-pointer"
                            >
                                Check
                            </button>
                        </div>

                        {coupons.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Checked Coupons</h3>
                                <div className="space-y-2">
                                    {coupons.map((coupon, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaTicketAlt className="text-[#A0522D]" />
                                                <span className="text-gray-700">{coupon}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveCoupon(index)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Savings:</span>
                                        <span className="text-green-600 font-semibold">
                                            {formatNumber(totalSavings)} đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="w-1/2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Cart Summary</h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatNumber(totalCart || totalCartNoLog)} đ</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>- {formatNumber(totalSavings)} đ</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-[#A0522D]">{formatNumber(finalTotal)} đ</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href="/menu"
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 text-center rounded-lg font-bold hover:bg-gray-300 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                            <button
                                onClick={handleCheckout}
                                className="flex-1 px-6 py-3 bg-[#A0522D] text-white text-center rounded-lg font-bold hover:bg-[#8B4513] transition-colors"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
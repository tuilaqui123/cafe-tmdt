"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaArrowRightLong } from "react-icons/fa6";
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { FaTrashAlt, FaTicketAlt, FaShoppingCart, FaRegStickyNote } from "react-icons/fa";
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import NoteModal from '@/components/noteModel';

const Cart = () => {
    const {
        totalCart, totalCartNoLog, cart, cartNoLog, 
        getCartByUserId, getCartById, deleteItemFromCart, deleteItemFromCartNoLog, 
        vouchers, setVouchers, checkVoucher, 
        getIdByName, getTotalUsedVouchers, getvoucherById, 
        updateQuantities, updateQuantitiesNoLog, setObjCartForOne} = useContext(AppContext)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)
    const [coupons, setCoupons] = useState([])
    const [totalSavings, setTotalSavings] = useState(0)
    const [finalTotal, setFinalTotal] = useState(totalCart)
    const [currentCoupon, setCurrentCoupon] = useState('')
    const [quantities, setQuantities] = useState([])
    const [notes, setNotes] = useState([])
    const [hasChanges, setHasChanges] = useState(false)
    const [hasNoteChanges, setHasNoteChanges] = useState(false)
    const [initialQuantities, setInitialQuantities] = useState([])
    const [showNoteModal, setShowNoteModal] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null)
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(null)
    const [initialNotes, setInitialNotes] = useState([])

    const router = useRouter()

    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number)
    }

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

    useEffect(() => {
        const fetchCoupons = async () => {
          if (vouchers.length === 0) {
            setCoupons([])
            return
          }
    
          const couponNames = await Promise.all(
            vouchers.map(async (voucherId) => {
              const voucherData = await getvoucherById(voucherId)
              return voucherData.name
            })
          )

          setCoupons(couponNames)
        }
    
        fetchCoupons()
    }, [vouchers, getvoucherById])

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
            })
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
            })
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
            if (hasChanges) {
                notifyError("Cần nhấn cập nhật trước khi thanh toán")
            } else {
                setObjCartForOne('')
                router.push("/checkout")
            }
        }
    }

    const handleNoteChange = (index, newNote) => {
        const newNotes = [...notes]
        newNotes[index] = newNote
        setNotes(newNotes)

        const hasQuantityChanges = quantities.some((quantity, idx) => quantity !== initialQuantities[idx])
        const hasNoteChanges = newNotes.some((note, idx) => note !== initialNotes[idx])
        setHasChanges(hasQuantityChanges || hasNoteChanges)
    }

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity <= 0) {
            notifyError("Không thể chỉnh sửa giá trị này")
            return
        }
        const newQuantities = [...quantities]
        newQuantities[index] = parseInt(newQuantity)
        setQuantities(newQuantities)

        const hasAnyChanges = newQuantities.some((quantity, idx) => quantity !== initialQuantities[idx])
        setHasChanges(hasAnyChanges)
    }

    const handleUpdateCart = async () => {
        const currentItems = cart.items || cartNoLog.items || []
        const productIds = []
        const updatedQuantities = []
        const updatedNotes = []
        const processedProducts = new Set()

        currentItems.forEach((item, index) => {
            const productId = item.product._id
            const hasQuantityChange = quantities[index] !== initialQuantities[index]
            const hasNoteChange = notes[index] !== initialNotes[index]

            if (hasQuantityChange || hasNoteChange) {
                if (!processedProducts.has(productId)) {
                    productIds.push(productId)
                    updatedQuantities.push(quantities[index] || item.quantity)
                    updatedNotes.push(notes[index] || item.note || '')
                    processedProducts.add(productId)
                }
            }
        })

        if (productIds.length > 0) {
            let res = {}
            if (localStorage.user) {
                res = await updateQuantities(productIds, updatedQuantities, updatedNotes)
            } else {
                res = await updateQuantitiesNoLog(productIds, updatedQuantities, updatedNotes)
            }
            if (res.success) {
                toast.success("Cập nhật giỏ hàng thành công", {
                    position: "top-right",
                    autoClose: 700,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    onClose: () => {
                        localStorage.user ? getCartByUserId() : getCartById(localStorage?.cartId)
                        setHasChanges(false)
                        setHasNoteChanges(false)
                    }
                })
            } else {
                notifyError("Có lỗi xảy ra khi cập nhật giỏ hàng")
            }
        }
    }

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

    useEffect(() => {
        if (cart && cart.items?.length > 0) {
            const cartQuantities = cart.items.map(item => item.quantity)
            setQuantities(cartQuantities)
            setInitialQuantities(cartQuantities)
        } else if (cartNoLog && cartNoLog.items?.length > 0) {
            const cartQuantities = cartNoLog.items.map(item => item.quantity)
            setQuantities(cartQuantities)
            setInitialQuantities(cartQuantities)
        } else {
            setQuantities([])
            setInitialQuantities([])
        }
    }, [cart, cartNoLog])

    useEffect(() => {
        const updateTotalSavings = async () => {
            if (vouchers.length > 0) {
                const totalRes = await getTotalUsedVouchers(vouchers, totalCart)
                setTotalSavings(totalCart - totalRes.total)
                setFinalTotal(totalRes.total)
            } else {
                setTotalSavings(0);
                setFinalTotal(totalCart || totalCartNoLog)
            }
        };
        updateTotalSavings()
    }, [vouchers, totalCart, totalCartNoLog, cart, cartNoLog])

    useEffect(() => {
        if (totalSavings > 0) {
            setFinalTotal((totalCart || totalCartNoLog) - totalSavings)
        } else {
            setFinalTotal(totalCart || totalCartNoLog)
        }
    }, [totalCart, totalCartNoLog, totalSavings, cart, cartNoLog])

    const handleCloseNoteModal = () => {
        setShowNoteModal(false)
        setSelectedNote(null)
    }

    return (
        <div className="mx-auto rounded-lg w-[90%] mt-5">
            <ToastContainer />
            {((cart.items!==undefined && cart.items?.length!==0) || (cartNoLog.items!==undefined && cartNoLog.items?.length!==0)) ? (
                <div className='mb-4'>
                    {/* <div className='flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center mb-4 px-4 md:mb-8'>
                        {stateOrder.map((ele, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-[#A0522D] text-white rounded-full font-bold transition-all duration-400 ease-in-out text-sm md:text-base">
                                        {ele.id}
                                    </div>
                                    <span className="text-black text-sm md:text-base hidden sm:inline">{ele.name}</span>
                                </div>
                            {ele.id!==3 && <FaArrowRightLong className="hidden md:block" />}
                            </div>
                        ))}
                    </div> */}

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full table-auto border-collapse mb-6">
                            <thead>
                                <tr className="text-left border-b border-gray-200 bg-[#A0522D] text-white">
                                    <th className="p-2">Sản phẩm</th>
                                    <th className="p-2">Kích cỡ</th>
                                    <th className="p-2">Giá</th>
                                    <th className="p-2">Số lượng</th>
                                    <th className="p-2">Tổng</th>
                                    <th className="p-2">Ghi chú</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                            {(() => {
                                let itemsToRender = cart?.items?.length > 0 ? cart.items : cartNoLog?.items || []
                                return itemsToRender.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 text-black hover:text-[#A0522D]">
                                        <td className="p-2">
                                            <div className="flex items-center">
                                                <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg mr-3"
                                                width={500}
                                                height={300}
                                                priority
                                                />
                                                <span className="font-medium">{item.product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-2">{item.size}</td>
                                        <td className="p-2">{formatNumber(item.price - (item.price*item.discount)/100)} đ</td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={quantities[index] || item.quantity}
                                                min="1"
                                                className="w-16 border border-gray-300 p-1 rounded"
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">{formatNumber((item.price - (item.price*item.discount)/100) * (quantities[index] || item.quantity))} đ</td>
                                        <td className="p-2">
                                            <button
                                                className="text-gray-600 hover:text-[#A0522D] transition-colors relative group"
                                                onClick={() => {
                                                setSelectedNote(item.note)
                                                setSelectedNoteIndex(index)
                                                setShowNoteModal(true)
                                                }}
                                            >
                                                <FaRegStickyNote className="text-xl" />
                                                {item.note && (
                                                <span className="absolute -top-2 -right-2 w-2 h-2 bg-[#A0522D] rounded-full"></span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteClick(item.product._id, item.size)}
                                            >
                                                <FaTrashAlt className='text-xl' />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            })()}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden space-y-4 px-4">
                    {(() => {
                        let itemsToRender = cart?.items?.length > 0 ? cart.items : cartNoLog?.items || []
                        return itemsToRender.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-start space-x-4">
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                        width={500}
                                        height={300}
                                        priority
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                                        <p className="text-sm font-medium text-[#A0522D] mt-1">
                                            {formatNumber(item.price - (item.price*item.discount)/100)} đ
                                        </p>
                                        
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    value={quantities[index] || item.quantity}
                                                    min="1"
                                                    className="w-16 border border-gray-300 p-1 rounded text-center"
                                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                />
                                                <button
                                                    className="text-gray-600 hover:text-[#A0522D] transition-colors"
                                                    onClick={() => {
                                                        setSelectedNote(item.note)
                                                        setSelectedNoteIndex(index)
                                                        setShowNoteModal(true)
                                                    }}
                                                >
                                                <FaRegStickyNote className="text-xl" />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDeleteClick(item.product._id, item.size)}
                                                >
                                                <FaTrashAlt className='text-xl' />
                                                </button>
                                            </div>
                                            <p className="font-medium text-[#A0522D]">
                                                {formatNumber((item.price - (item.price*item.discount)/100) * (quantities[index] || item.quantity))} đ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    })()}
                    </div>
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center py-8 md:py-16 px-4 rounded-lg shadow-sm">
                    <FaShoppingCart className="text-[#A0522D] text-4xl md:text-6xl mb-4" />
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-500 text-center mb-6 text-sm md:text-base">
                        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng của mình
                    </p>
                    <Link 
                        href="/menu" 
                        className="px-6 py-3 bg-[#A0522D] text-white rounded-full hover:bg-[#8B4513] transition-colors text-sm md:text-base"
                    >
                        Tiếp tục mua hàng
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

            {((cart.items!==undefined && cart.items?.length!==0) || (cartNoLog.items!==undefined && cartNoLog.items?.length!==0)) && (
                <button
                    className={`w-full md:w-auto px-6 py-3 mb-4 text-white text-center rounded-lg font-bold transition-colors ${hasChanges ? 'bg-[#A0522D] hover:bg-[#8B4513] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                    onClick={handleUpdateCart}
                    disabled={!hasChanges && !hasNoteChanges}
                >
                    Cập nhật
                </button>
            )}

            <div className={`flex flex-col md:flex-row ${(localStorage.user) ? "md:items-start md:justify-between" : "md:justify-end"} gap-6 md:gap-8`}>   
                {((cart.items?.length!=undefined && cart.items?.length!=0) && localStorage.user ) && (
                    <div className="w-full md:w-[40%]">
                        <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 
                            border rounded-full shadow-md bg-white mb-3 md:mb-4">
                            <FaTicketAlt className="text-gray-400 text-lg md:text-xl ml-2" />
                            <input
                                type="text"
                                value={currentCoupon}
                                onChange={(e) => setCurrentCoupon(e.target.value)}
                                placeholder="Mã giảm giá"
                                className="flex-1 border-none outline-none 
                                    text-gray-500 placeholder-gray-400
                                    text-sm md:text-base min-w-0"
                            />
                            <div className="h-6 md:h-8 border-l border-gray-400"></div>
                            <button 
                                onClick={handleCheckVoucher}
                                className="whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 
                                    bg-white text-gray-600 
                                    text-sm md:text-base font-medium 
                                    rounded-lg hover:text-[#A0522D] 
                                    transition cursor-pointer"
                            >
                                Kiểm tra
                            </button>
                        </div>

                        {coupons.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
                                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-gray-800">
                                    Các mã giảm giá đã kiểm tra
                                </h3>
                                <div className="space-y-2">
                                    {coupons.map((coupon, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between 
                                                bg-gray-50 p-2 md:p-3 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <FaTicketAlt className="text-[#A0522D] text-sm md:text-base flex-shrink-0" />
                                                <span className="text-gray-700 text-sm md:text-base truncate">
                                                    {coupon}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveCoupon(index)}
                                                className="text-red-500 hover:text-red-700 
                                                    transition-colors p-1 md:p-1.5 flex-shrink-0"
                                            >
                                                <FaTrashAlt className="text-sm md:text-base" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm md:text-base">
                                            Tổng tiền giảm:
                                        </span>
                                        <span className="text-green-600 font-semibold text-sm md:text-base">
                                            {formatNumber(totalSavings)} đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {((cart.items!==undefined && cart.items?.length!==0) || (cartNoLog.items!==undefined && cartNoLog.items?.length!==0)) && (
                    <div className="w-full md:w-1/2">
                        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-800">
                                Tổng thanh toán
                            </h2>

                            <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                                <div className="flex justify-between text-sm md:text-base text-gray-600">
                                    <span>Tổng tiền</span>
                                    <span>{formatNumber(totalCart || totalCartNoLog)} đ</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base text-gray-600">
                                    <span>Tiền ship</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base text-green-600">
                                    <span>Giảm giá</span>
                                    <span>- {formatNumber(totalSavings)} đ</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-3 md:pt-4 mb-4 md:mb-6">
                                <div className="flex justify-between font-bold">
                                    <span className="text-base md:text-lg">Tổng</span>
                                    <span className="text-base md:text-lg text-[#A0522D]">
                                        {formatNumber(finalTotal)} đ
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                                <Link
                                    href="/menu"
                                    className="w-full px-4 md:px-6 py-2 md:py-3 
                                        bg-gray-200 text-gray-700 
                                        text-center rounded-lg 
                                        text-sm md:text-base font-bold 
                                        hover:bg-gray-300 transition-colors"
                                >
                                    Tiếp tục mua hàng
                                </Link>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full px-4 md:px-6 py-2 md:py-3 
                                        bg-[#A0522D] text-white 
                                        text-center rounded-lg 
                                        text-sm md:text-base font-bold 
                                        hover:bg-[#8B4513] transition-colors"
                                >
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <NoteModal 
                showModal={showNoteModal}
                note={selectedNote}
                index={selectedNoteIndex}
                onClose={handleCloseNoteModal}
                handleNoteChange={handleNoteChange}
            />
        </div>
    )
}

export default Cart
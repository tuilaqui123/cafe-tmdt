"use client"
import { useEffect } from 'react'
import Image from 'next/image'
import { FaArrowRightLong } from "react-icons/fa6";
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { FaTrashAlt, FaTicketAlt, FaShoppingCart } from "react-icons/fa";
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
    const {cart, cartNoLog, getCartByUserId, getCartById, deleteItemFromCart} = useContext(AppContext)
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number)
    }

    const stateOrder = [
        { id: 1, name: "Shopping Cart" },
        { id: 2, name: "Payment & Delivery Options" },
        { id: 3, name: "Order Received" },
    ]

    const handleDeleteItem = async (productId, size) => {
        const res = await deleteItemFromCart(productId, size)

        if (res.success===false) {
            toast.error(res.message, {
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
                getCartByUserId()
            }
        })
    }

    useEffect(() => {
        if (localStorage.user) {
            getCartByUserId()
        } else {
            getCartById(localStorage?.cartId)
        }
    }, [cart?.items.length])

    return (
        <div className="mx-auto rounded-lg w-[90%]">
        <ToastContainer />
            {(cart.items.length!==0 || cartNoLog.items?.length!==0) ? (
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
                            if (cart && cart.items.length > 0) {
                                itemsToRender = cart.items
                            } else if (cartNoLog && cartNoLog.items.length > 0) {
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
                                    <td className="p-2">{formatNumber(item.price)} đ</td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            className="w-16 border border-gray-300 p-1 rounded"
                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">{formatNumber(item.price * item.quantity)} đ</td>
                                    <td className="p-2">
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteItem(item.product._id, item.size)}
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

            {/* Coupon Input */}
            {/* <div className="flex items-center gap-4 mb-6">
                <input
                type="text"
                placeholder="Coupon Code"
                className="flex-1 border border-gray-300 p-2 rounded"
                />
                <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                Apply Coupon
                </button>
            </div> */}
            {cart.items.length!==0 && (
                <div className="flex items-center gap-3 p-2 border rounded-full shadow-md bg-white w-[40%]">
                    <FaTicketAlt className="text-gray-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Coupon Code"
                        className="flex-1 border-none outline-none text-gray-500 placeholder-gray-400"
                    />

                    <div className="h-8 border-l border-gray-400"></div>

                    <div className="px-4 py-2 bg-white text-gray-600 font-medium rounded-lg hover:text-[#A0522D] transition cursor-pointer">
                        Apply Coupon
                    </div>
                </div>
            )}
            {/* <CartTotals total={calculateTotal()} /> */}
    </div>
    )
}

export default Cart
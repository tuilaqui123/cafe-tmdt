"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaArrowRightLong } from "react-icons/fa6";
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { FaTrashAlt, FaTicketAlt } from "react-icons/fa";

const Cart = () => {
    const {cart} = useContext(AppContext)
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number)
    }

    const stateOrder = [
        { id: 1, name: "Shopping Cart" },
        { id: 2, name: "Payment & Delivery Options" },
        { id: 3, name: "Order Received" },
    ]
    return (
        <div className="mx-auto rounded-lg w-[90%]">
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
                {cart.length!==0 && cart.map((item, index) => (
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
                                onClick={() => removeItem(item.id)}
                            >
                                <FaTrashAlt className='text-xl'/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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
            {/* <CartTotals total={calculateTotal()} /> */}
    </div>
    )
}

export default Cart
"use client"
import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link';
import { FaRegStickyNote } from "react-icons/fa";

const OrderId = ({ params }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingorder, setisLoadingorder] = useState(true)
    const [orders, setOrders] = useState([])
    const [noteInModal, setnoteInModal] = useState('')
    const [showNoteModal, setShowNoteModal] = useState(false)

    const { slug } = React.use(params);

    const getOrder = () => {
        setisLoadingorder(true)

        fetch(`http://localhost:8081/v1/api/user/orders/${slug}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data)
            })
            .finally(() => {
                setisLoadingorder(false)
            })
    }

    useEffect(() => {
        getOrder()

    }, [])

    useEffect(() => {
        const handleIsLoanding = () => {
            if (isLoadingorder) {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        }

        handleIsLoanding()
    }, [isLoadingorder])

    return (
        <>
            {!isLoading && <div className='mt-10 mb-20'>
                {showNoteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa ghi chú</h3>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#A0522D]"
                                rows="4"
                                value={noteInModal}
                                placeholder="Nhập ghi chú..."
                                maxLength={200}
                                readOnly
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    onClick={() => {
                                        setnoteInModal('')
                                        setShowNoteModal(false)
                                    }}
                                >
                                    Tắt
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className='transition-all duration-500 mx-5'
                >
                    <h1 className="font-bold mb-4 text-[40px] ">Chi tiết đơn hàng</h1>

                    <table className="w-full text-left"
                    >
                        <thead>
                            <tr className="border-b border-gray-200 bg-[#A0522D] rounded-tl-[5px] rounded-bl-[5px] text-white">
                                <th className="p-4 text-center w-[20%]"></th>
                                <th className="p-4 text-center">Tên sản phẩm</th>

                                <th className="p-4 text-center lg:hidden">Mô tả</th>

                                <th className="p-4 text-center lg:table-cell hidden">Kích cỡ</th>
                                <th className="p-4 text-center lg:table-cell hidden">Số lượng</th>
                                <th className="p-4 text-center lg:table-cell hidden">Giá</th>
                                <th className="p-4 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.items.map((item, index) => {
                                    return (
                                        <tr key={index} className="border-b border-black">
                                            <td className="text-center h-[130px] w-[20%]">
                                                <Link
                                                    href={`/menu/${item.product._id}`}
                                                >
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="mx-auto lg:w-[100px] lg:h-[100px] w-[80px] h-[80px] bg-[#EEEEEE] hover:cursor-pointer hover:scale-[1.1] transition-all"
                                                    />
                                                </Link>
                                            </td>
                                            <td className="text-center h-[130px]">{item.product.name}</td>

                                            <td className='text-center h-[130px] lg:hidden flex flex-col justify-evenly items-center'>
                                                <div className='flex'>
                                                    <p className='mr-4'><span className=' font-bold'>Size:</span> {item.size}</p>
                                                    <p><span className=' font-bold'>Price:</span> {item.price.toLocaleString('vi-VN')} đ</p>
                                                </div>

                                                <div className='flex'>
                                                    <input className={`w-[50px] text-center rounded-[3px] mx-5`}
                                                        min="1"
                                                        type="text"
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                </div>
                                            </td>

                                            <td className="text-center h-[130px] lg:table-cell hidden">{item.size}</td>
                                            <td className="h-[130px] lg:flex items-center justify-center hidden">
                                                <input className={`w-[50px] text-center rounded-[3px] mx-5`}
                                                    min="1"
                                                    type="text"
                                                    value={item.quantity}
                                                    readOnly
                                                />

                                            </td>
                                            <td className="text-center h-[130px] lg:table-cell hidden">{(item.price * (1 - item.discount / 100)).toLocaleString('vi-VN')} đ</td>

                                            <td className="text-center h-[130px]">
                                                <div className='flex flex-col justify-between items-center'>
                                                    <button
                                                        className="text-gray-600 hover:text-[#A0522D] transition-colors relative group"
                                                        onClick={() => {
                                                            setnoteInModal(item.note)
                                                            setShowNoteModal(true)
                                                        }}
                                                    >
                                                        <FaRegStickyNote className="size-8 lg:size-6" />
                                                        {item.note && (
                                                            <span className="absolute -top-2 -right-2 w-2 h-2 bg-[#A0522D] rounded-full"></span>
                                                        )}
                                                        <span className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
                                                            {item.note ? 'Xem ghi chú' : 'Không có ghi chú'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </div>}
        </>
    )
}

export default OrderId
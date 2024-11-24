"use client"
import React, { useEffect, useState } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaPlus, FaMinus } from "react-icons/fa";

const CheckOut = () => {


    const [paymentMethod, setPaymentMethod] = useState('momo')

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')

    const [note, setNote] = useState('')
    const [fakedata, setfakedata] = useState([{
        id: "1",
        img: "data:image/jpeg;base64,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",
        name: "Cà phê sữa đá",
        size: "L",
        quantity: "20",
        price: 20000
    },
    {
        id: "2",
        img: "data:image/jpeg;base64,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",
        name: "Cà phê đen",
        size: "M",
        quantity: "8",
        price: 25000
    },
    {
        id: "3",
        img: "data:image/jpeg;base64,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",
        name: "Cà phê cc",
        size: "S",
        quantity: "5",
        price: 5000000
    }])

    const [allProvince, setAllProvince] = useState([])
    const [allDistrict, setAllDistrict] = useState([])
    const [allWard, setAllWard] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingAllPrvince, setisLoadingAllPrvince] = useState(false)

    const getAllProvince = () => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then(res => res.json())
            .then(data => { setAllProvince(data) })
            .finally(() => { setisLoadingAllPrvince(true) })
    }

    const getAllDistrictProvince = (code) => {
        if (code != '') {
            fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setAllDistrict(data.districts)
                })
        }
    }

    const getAllWardDistrict = (code) => {
        if (code != '') {
            fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
                .then(res => res.json())
                .then(data => { setAllWard(data.wards) })
        }
    }

    // const updateCart = () => {
    //     fetch("https://provinces.open-api.vn/api/p/")
    //         .then(res => res.json())
    //         .then(data => { setAllProvince(data) })
    //         .finally(() => { setisLoadingAllPrvince(true) })
    // }


    useEffect(() => {
        getAllProvince()
    }, [])

    useEffect(() => {
        const handleIsLoanding = () => {
            if (isLoadingAllPrvince) {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        }

        handleIsLoanding()
    }, [isLoadingAllPrvince])

    return (
        <>
            {
                isLoading ? <div className='mx-20'>
                    <div className='flex mt-5 items-center' >
                        <AiOutlineArrowLeft />
                        <p className=' text-[15px] text-black ml-2'>Back to cart</p>
                    </div>

                    <p className=' text-[38px] font-bold text-black mt-5'>Complete order, Sophia</p>

                    <div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="p-4 text-center w-[20%]">Product</th>
                                    <th className="p-4 text-center">Description</th>
                                    <th className="p-4 text-center">Size</th>
                                    <th className="p-4 text-center">Quantity</th>
                                    <th className="p-4 text-center">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    fakedata.map((item, index) => {
                                        return (
                                            <tr key={index} className="border-b border-black">
                                                <td className="text-center h-[130px] w-[20%]">
                                                    <img
                                                        src={item.img}
                                                        alt={item.name}
                                                        className="mx-auto h-[80%]"
                                                    />
                                                </td>
                                                <td className="text-center h-[130px]">{item.name}</td>
                                                <td className="text-center h-[130px]">{item.size}</td>
                                                <td className="h-[130px] flex items-center justify-center">
                                                    <div
                                                        className='flex justify-center items-center bg-[black] w-8 h-8 text-center leading-[30px] rounded-[5px] hover:cursor-pointer hover:opacity-70'
                                                        onClick={() => {
                                                            const updatedData = fakedata.map((i) => {
                                                                if (item.id == i.id && i.quantity > 0) {
                                                                    i.quantity = Number(i.quantity) - 1
                                                                    return i;
                                                                }
                                                                return i;
                                                            });

                                                            setfakedata(updatedData);
                                                        }}
                                                    >
                                                        <FaMinus className='text-[20px] text-white font-extrabold' />
                                                    </div>

                                                    <input className={`w-[50px] text-center rounded-[3px] mx-5`}
                                                        min="1"
                                                        type="text"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            if (!value || Number(value) <= 0) {
                                                                e.target.style.borderColor = "red";
                                                                e.target.style.borderWidth = "2px";
                                                                e.target.style.borderStyle = "solid";
                                                            } else {
                                                                e.target.style.border = "none";
                                                            }
                                                        }}
                                                    />

                                                    <div
                                                        className='flex justify-center items-center bg-[black] w-8 h-8 text-center leading-[30px] rounded-[5px] hover:cursor-pointer hover:opacity-70'
                                                        onClick={() => {
                                                            const updatedData = fakedata.map((i) => {
                                                                if (item.id == i.id) {
                                                                    i.quantity = Number(i.quantity) + 1
                                                                    return i;
                                                                }
                                                                return i;
                                                            });

                                                            setfakedata(updatedData);
                                                        }}
                                                    >
                                                        <FaPlus className='text-[20px] text-white font-extrabold' />
                                                    </div>
                                                </td>
                                                <td className="text-center h-[130px]">{item.price.toLocaleString('vi-VN')} đ</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className='mt-20 flex justify-between w-[86%] mx-auto mb-10'>
                        <div className='w-[40%]'>
                            <p className='text-[20px] font-bold text-black mb-4'>Delivery Information: </p>

                            <div className="relative my-5">
                                <input
                                    type="text"
                                    id="name"
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-black appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=''
                                    value={name} onChange={(e) => { setName(e.target.value) }}
                                />
                                <label htmlFor="name" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f1debc] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Name</label>
                            </div>

                            <div className="relative my-5">
                                <input
                                    type="text"
                                    id="phone"
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-black appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=''
                                    value={phone} onChange={(e) => { setPhone(e.target.value) }}
                                />
                                <label htmlFor="phone" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f1debc] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Phone</label>
                            </div>

                            <select
                                defaultValue=""
                                className="my-5 border-2 bg-[#f1debc] border-[black] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-h-[50px] focus:bg-white"
                                onChange={(e) => {
                                    getAllDistrictProvince(e.target.value)
                                    setAllDistrict([])
                                    setAllWard([])
                                }}
                            >
                                <option value="">
                                    Province
                                </option>
                                {
                                    allProvince.map((p, index) => {
                                        return (
                                            <option key={index} value={p.code} onClick={() => {
                                                setProvince(p.name)
                                            }}>
                                                {p.name}
                                            </option>
                                        )
                                    })
                                }
                            </select>

                            <select
                                defaultValue=""
                                className="my-5 border-2 bg-[#f1debc] border-[black] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-h-[50px] focus:bg-white"
                                onChange={(e) => {
                                    getAllWardDistrict(e.target.value)
                                    setAllWard([])
                                }}
                            >
                                <option value="">
                                    District
                                </option>
                                {
                                    allDistrict.map((p, index) => {
                                        return (
                                            <option key={index} value={p.code} onClick={() => {
                                                setDistrict(p.name)
                                            }}>
                                                {p.name}
                                            </option>
                                        )
                                    })
                                }
                            </select>

                            <select
                                defaultValue=""
                                className="my-5 border-2 bg-[#f1debc] border-[black] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-h-[50px] focus:bg-white"
                                onChange={(e) => {
                                    setWard(e.target.value)
                                }}
                            >
                                <option value="">
                                    Ward
                                </option>
                                {
                                    allWard.map((p, index) => {
                                        return (
                                            <option key={index} value={p.code} onClick={() => {
                                                setWard(p.name)
                                            }}>
                                                {p.name}
                                            </option>
                                        )
                                    })
                                }
                            </select>

                            <div className="relative my-5">
                                <input
                                    type="text"
                                    id="address"
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-black appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=''
                                    value={address} onChange={(e) => { setAddress(e.target.value) }}
                                />
                                <label htmlFor="address" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f1debc] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Address</label>
                            </div>

                            <div className='relative my-5'>
                                <textarea
                                    id="note"
                                    placeholder=''
                                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-black appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer h-[100px]'
                                    value={note}
                                    onChange={(e) => { setNote(e.target.value) }}
                                ></textarea>
                                <label htmlFor="note" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#f1debc] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Note</label>
                            </div>

                        </div>

                        <div>
                            <div>
                                <p className='text-[20px] font-bold text-black mb-3'>Order summary: </p>

                                <div className=' border-b-2 border-[black] border-solid py-3'>
                                    <div className='text-[#808080] flex justify-between mb-2'>
                                        <p>Subtotal</p>
                                        <p>{fakedata.reduce((total, item) => total + item.price, 0).toLocaleString('vi-VN')} đ</p>
                                    </div>

                                    <div className='text-[#808080] flex justify-between'>
                                        <p>Discount</p>
                                        <p>200000</p>
                                    </div>
                                </div>

                                <div className='border-b-2 border-[black] border-solid flex justify-between py-3 font-bold'>
                                    <p className='text-[18px] text-black  '>Total: </p>
                                    <p className='text-black'>50.000.000 đ</p>
                                </div>

                            </div>

                            <div className='mt-14'>
                                <p className='text-[20px] font-bold text-black mb-3'>Select payment method: </p>

                                <div className=' cursor-pointer flex items-center' onClick={() => { setPaymentMethod('momo') }}>
                                    <div className={`w-5 h-5 bg-white  rounded-full mr-3 ${paymentMethod == 'momo' ? 'border-8 border-black' : ''}`}></div>
                                    <div className='flex justify-between items-center flex-1 mr-3'>
                                        <p className='mr-10'>Payments with MoMo E-Wallet</p>
                                        <img className=' w-[30px]' src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="momo" />
                                    </div>
                                </div>

                                <div className=' cursor-pointer flex items-center' onClick={() => { setPaymentMethod('cod') }}>
                                    <div className={`w-5 h-5 bg-white  rounded-full mr-3 ${paymentMethod == 'cod' ? 'border-8 border-black' : ''}`}></div>
                                    <div className='flex justify-between items-center flex-1'>
                                        <p className='mr-6'>Cash on delivery</p>
                                        <img className=' w-[60px]' src="https://cdn.iconscout.com/icon/free/png-256/free-cod-icon-download-in-svg-png-gif-file-formats--credit-debit-bank-transaction-payment-methods-vol-1-pack-business-icons-32260.png" alt="COD" />
                                    </div>
                                </div>
                            </div>

                            <div className='w-full bg-[#222222] py-3 rounded-[10px] mt-14 cursor-pointer hover:opacity-90'>
                                <div className='flex justify-center items-center text-white '>
                                    <p className='mr-3'>Payment</p>
                                    <AiOutlineArrowRight />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                    :
                    <></>
            }
        </>
    )
}

export default CheckOut
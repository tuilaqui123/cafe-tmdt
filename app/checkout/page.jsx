"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import { AppContext } from "@/context/AppContext";

const CheckOut = () => {
    // const {cart} = useContext(AppContext)

    const router = useRouter()

    const [paymentMethod, setPaymentMethod] = useState('momo')

    const itemTableElement = useRef(null)

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')

    const [note, setNote] = useState('')

    const [cart, setCart] = useState([])

    const [isOpen, setIsOpen] = useState(true)


    const [allProvince, setAllProvince] = useState([])
    const [allDistrict, setAllDistrict] = useState([])
    const [allWard, setAllWard] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingAllPrvince, setisLoadingAllPrvince] = useState(true)
    const [isLoadingCart, setisLoadingCart] = useState(true)

    const getAllProvince = () => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then(res => res.json())
            .then(data => { setAllProvince(data) })
            .finally(() => { setisLoadingAllPrvince(false) })
    }

    const getAllDistrictProvince = (code) => {
        if (code != '') {
            fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
                .then(res => res.json())
                .then(data => {
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

    const addOrder = () => {
        if (localStorage.getItem("user")) {
            fetch(`http://localhost:8081/v1/api/user/orders`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: localStorage.getItem("user"),
                    items: cart.items,
                    voucher: [],
                    paymentStatus: "paid",
                    paymentMethod: "momo",
                    note: note
                })
            })
                .then(() => {
                    getAllFavoriteFilms()
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        else {
            fetch(`http://localhost:8081/v1/api/user/carts/getCartById/${localStorage.getItem("cart")}`)
                .then(res => res.json())
                .then(data => { setCart(data) })
                .finally(() => {
                    setisLoadingCart(false)
                })
        }
    }

    const getCart = () => {
        setisLoadingCart(true)
        if (localStorage.getItem("user")) {
            fetch(`http://localhost:8081/v1/api/user/carts/getCartByUserId/${JSON.parse(localStorage.user)._id}`)
                .then(res => res.json())
                .then(data => { setCart(data) 
                    console.log(data)
                })
                .finally(() => {
                    setisLoadingCart(false)
                    console.log(cart)
                })
        }
        else {
            fetch(`http://localhost:8081/v1/api/user/carts/getCartById/${localStorage.getItem("cart")}`)
                .then(res => res.json())
                .then(data => { setCart(data) })
                .finally(() => {
                    setisLoadingCart(false)
                })
        }
    }


    useEffect(() => {
        getAllProvince()

        // console.log(cart)
        getCart()
    }, [])

    useEffect(() => {
        const handleIsLoanding = () => {
            if (isLoadingAllPrvince || isLoadingCart) {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        }

        handleIsLoanding()
    }, [isLoadingAllPrvince, isLoadingCart])

    useEffect(() => {
        if (!isLoading) {
            const handleWindowResize = () => {
                if (window.innerWidth > 768) {
                    setIsOpen(true)
                }
            }

            window.addEventListener('resize', handleWindowResize)

            return () => {
                window.removeEventListener('resize', handleWindowResize)
            }
        }
    }, [isLoading])

    return (
        <>
            {
                !isLoading ? <div className='lg:mx-20 mx-4 select-none'>
                    <div className='flex mt-5 items-center hover:cursor-pointer' onClick={() => router.push('/cart')}>
                        <AiOutlineArrowLeft />
                        <p className=' text-[15px] text-black ml-2'>Back to cart</p>
                    </div>

                    <p className='lg:text-[38px] text-[30px] font-bold text-black mt-5'>Complete order {cart.userId ? cart.userId?.name + "," : ""}</p>

                    <div className='mt-3'>
                        {/* <div className='hover:opacity-90 hover:cursor-pointer bg-black h-[40px] md:hidden rounded-[5px]' onClick={() => { setIsOpen(!isOpen) }}>
                            <p className='text-white text-center leading-[40px]'>Detail Item</p>
                        </div> */}

                        <div
                            className='overflow-hidden transition-all duration-500'
                            // ref={itemTableElement}
                            // style={{
                            //     maxHeight: isOpen ? `${itemTableElement.current?.scrollHeight}px` : "0px",
                            // }}
                        >
                            <table className="w-full text-left"

                            >
                                <thead>
                                    <tr className="border-b border-black">
                                        <th className="p-4 text-center w-[20%]"></th>
                                        <th className="p-4 text-center">Name</th>

                                        <th className="p-4 text-center lg:hidden">Description</th>

                                        <th className="p-4 text-center lg:table-cell hidden">Size</th>
                                        <th className="p-4 text-center lg:table-cell hidden">Quantity</th>
                                        <th className="p-4 text-center lg:table-cell hidden">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cart.items.map((item, index) => {
                                            return (
                                                <tr key={index} className="border-b border-black">
                                                    <td className="text-center h-[130px] w-[20%]">
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.name}
                                                            className="mx-auto h-[80%] bg-[#EEEEEE] hover:cursor-pointer hover:scale-[1.1] transition-all"
                                                            onClick={() => router.push(`/menu/${item.product._id}`)}
                                                        />
                                                    </td>
                                                    <td className="text-center h-[130px]">{item.product.name}</td>

                                                    <td className='text-center h-[130px] lg:hidden flex flex-col justify-evenly items-center'>
                                                        <div className='flex'>
                                                            <p className='mr-4'><span className=' font-bold'>Size:</span> {item.size}</p>
                                                            <p><span className=' font-bold'>Price:</span> {item.price.toLocaleString('vi-VN')} đ</p>
                                                        </div>

                                                        <div className='flex'>
                                                            <div
                                                                className='flex justify-center items-center bg-[black] w-12 h-10 text-center leading-[30px] rounded-[5px] hover:cursor-pointer hover:opacity-70'
                                                                onClick={() => {
                                                                    if (item.quantity !== '') {
                                                                        const updatedData = {
                                                                            ...cart,
                                                                            items: cart.items.map((i) => {
                                                                                if (item.product._id === i.product._id && i.quantity > 0) {
                                                                                    return { ...i, quantity: i.quantity - 1 };
                                                                                }
                                                                                return i;
                                                                            }),
                                                                        };

                                                                        setCart(updatedData);
                                                                    }
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
                                                                    if (/^\d*$/.test(value) && (value === "" || Number(value) >= 0)) {
                                                                        if (!value || Number(value) <= 0) {
                                                                            e.target.style.borderColor = "red";
                                                                            e.target.style.borderWidth = "2px";
                                                                            e.target.style.borderStyle = "solid";

                                                                            const updatedData = {
                                                                                ...cart,
                                                                                items: cart.items.map((i) => {
                                                                                    if (item.product._id === i.product._id) {
                                                                                        return { ...i, quantity: value };
                                                                                    }
                                                                                    return i;
                                                                                }),
                                                                            };

                                                                            setCart(updatedData);
                                                                        } else {
                                                                            e.target.style.border = "none";

                                                                            const updatedData = {
                                                                                ...cart,
                                                                                items: cart.items.map((i) => {
                                                                                    if (item.product._id === i.product._id) {
                                                                                        return { ...i, quantity: Number(value) }; // Chuyển giá trị hợp lệ thành số
                                                                                    }
                                                                                    return i;
                                                                                }),
                                                                            };

                                                                            setCart(updatedData);
                                                                        }
                                                                    }
                                                                }}
                                                            />

                                                            <div
                                                                className='flex justify-center items-center bg-[black] w-12 h-10 text-center leading-[30px] rounded-[5px] hover:cursor-pointer hover:opacity-70'
                                                                onClick={() => {
                                                                    if (item.quantity !== '') {
                                                                        const updatedData = {
                                                                            ...cart,
                                                                            items: cart.items.map((i) => {
                                                                                if (item.product._id === i.product._id) {
                                                                                    return { ...i, quantity: i.quantity + 1 };
                                                                                }
                                                                                return i;
                                                                            }),
                                                                        };

                                                                        setCart(updatedData);
                                                                    }
                                                                }}
                                                            >
                                                                <FaPlus className='text-[20px] text-white font-extrabold' />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="text-center h-[130px] lg:table-cell hidden">{item.size}</td>
                                                    <td className="h-[130px] lg:flex items-center justify-center hidden">
                                                        <div
                                                            className='flex justify-center items-center bg-[black] w-8 h-8 text-center leading-[30px] rounded-[5px] hover:cursor-pointer hover:opacity-70'
                                                            onClick={() => {
                                                                if (item.quantity !== '') {
                                                                    const updatedData = {
                                                                        ...cart,
                                                                        items: cart.items.map((i) => {
                                                                            if (item.product._id === i.product._id && i.quantity > 0) {
                                                                                return { ...i, quantity: i.quantity - 1 };
                                                                            }
                                                                            return i;
                                                                        }),
                                                                    };

                                                                    setCart(updatedData);
                                                                }
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

                                                                if (/^\d*$/.test(value) && (value === "" || Number(value) >= 0)) {
                                                                    if (!value || Number(value) <= 0) {
                                                                        e.target.style.borderColor = "red";
                                                                        e.target.style.borderWidth = "2px";
                                                                        e.target.style.borderStyle = "solid";

                                                                        const updatedData = {
                                                                            ...cart,
                                                                            items: cart.items.map((i) => {
                                                                                if (item.product._id === i.product._id) {
                                                                                    return { ...i, quantity: value };
                                                                                }
                                                                                return i;
                                                                            }),
                                                                        };

                                                                        setCart(updatedData);
                                                                    } else {
                                                                        e.target.style.border = "none";

                                                                        const updatedData = {
                                                                            ...cart,
                                                                            items: cart.items.map((i) => {
                                                                                if (item.product._id === i.product._id) {
                                                                                    return { ...i, quantity: Number(value) }; // Chuyển giá trị hợp lệ thành số
                                                                                }
                                                                                return i;
                                                                            }),
                                                                        };

                                                                        setCart(updatedData);
                                                                    }

                                                                }
                                                            }}
                                                        />

                                                        <div
                                                            className='flex justify-center items-center bg-[black] w-8 h-8 text-center leading-[30px] rounded-[5px] hover:cursor-pointer hover:opacity-70'
                                                            onClick={() => {
                                                                if (item.quantity !== '') {
                                                                    const updatedData = {
                                                                        ...cart,
                                                                        items: cart.items.map((i) => {
                                                                            if (item.product._id === i.product._id) {
                                                                                return { ...i, quantity: i.quantity + 1 };
                                                                            }
                                                                            return i;
                                                                        }),
                                                                    };

                                                                    setCart(updatedData);
                                                                }
                                                            }}
                                                        >
                                                            <FaPlus className='text-[20px] text-white font-extrabold' />
                                                        </div>
                                                    </td>
                                                    <td className="text-center h-[130px] lg:table-cell hidden">{item.price.toLocaleString('vi-VN')} đ</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <div className=' lg:mt-20 mt-10 flex flex-col lg:flex-row justify-between w-full lg:w-[86%] mx-auto lg:mb-10'>
                        <div className='lg:order-none lg:w-[40%] w-full order-2 '>
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
                                    
                                    setDistrict('')
                                    setWard('')
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
                                    setWard('')
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
                                    // setWard(e.target.value)
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
                                        <p>{cart.items.reduce((total, item) => total + item.price*item.quantity, 0).toLocaleString('vi-VN')} đ</p>
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

                            <div className='lg:mt-14 my-8'>
                                <p className='text-[20px] font-bold text-black mb-3'>Select payment method: </p>

                                <div className=' cursor-pointer flex items-center py-3' onClick={() => { setPaymentMethod('momo') }}>
                                    <div className={`w-5 h-5 bg-white  rounded-full mr-3 ${paymentMethod == 'momo' ? 'border-8 border-black' : ''}`}></div>
                                    <div className='flex justify-between items-center flex-1 mr-3'>
                                        <p className='mr-10'>Payments with MoMo E-Wallet</p>
                                        <img className=' w-[30px]' src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="momo" />
                                    </div>
                                </div>

                                <div className=' cursor-pointer flex items-center py-3' onClick={() => { setPaymentMethod('cod') }}>
                                    <div className={`w-5 h-5 bg-white  rounded-full mr-3 ${paymentMethod == 'cod' ? 'border-8 border-black' : ''}`}></div>
                                    <div className='flex justify-between items-center flex-1'>
                                        <p className='mr-6'>Cash on delivery</p>
                                        <img className=' w-[60px]' src="https://cdn.iconscout.com/icon/free/png-256/free-cod-icon-download-in-svg-png-gif-file-formats--credit-debit-bank-transaction-payment-methods-vol-1-pack-business-icons-32260.png" alt="COD" />
                                    </div>
                                </div>
                            </div>

                            <div className='hidden lg:block w-full bg-[#222222] py-3 rounded-[10px] mt-14 cursor-pointer hover:opacity-90'>
                                <div className='flex justify-center items-center text-white '>
                                    <p className='mr-3'>Payment</p>
                                    <AiOutlineArrowRight />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='lg:hidden my-5 w-full bg-[#222222] py-4 rounded-[10px] mt-1 cursor-pointer hover:opacity-90'>
                        <div className='flex justify-center items-center text-white '>
                            <p className='mr-3'>Payment</p>
                            <AiOutlineArrowRight />
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
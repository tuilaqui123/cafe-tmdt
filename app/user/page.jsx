"use client"
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const AccountInfo = ({ position, select }) => {
    const provinceSelect = useRef(null)
    const districtSelect = useRef(null)
    const wardSelect = useRef(null)

    const [email, setEmail] = useState("")
    const [userId, setUserId] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState('')

    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')

    const [allProvince, setAllProvince] = useState([])
    const [allDistrict, setAllDistrict] = useState([])
    const [allWard, setAllWard] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingAllPrvince, setisLoadingAllPrvince] = useState(true)
    const [isLoadingInfoUser, setisLoadingInfoUser] = useState(false)

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

    const getInfoUser = () => {
        if (localStorage.user) {
            setisLoadingInfoUser(true)
            fetch(`http://localhost:8081/v1/api/user/users/${JSON.parse(localStorage.user)._id}`)
                .then(res => res.json())
                .then(data => {
                    setName(data.name)
                    setPhone(data.phone)
                    setEmail(data.email)

                    setProvince(provinceData)
                    setDistrict(districtData)
                    setWard(wardData)
                    setAddress(addressData)

                    allProvince.find(pr => pr.name == provinceData)
                })
                .finally(() => {
                    setisLoadingInfoUser(false)
                })
        }
    }

    useEffect(() => {
        getAllProvince()

        getInfoUser()
    }, [])

    useEffect(() => {
        const handleIsLoanding = () => {
            if (isLoadingAllPrvince || isLoadingInfoUser) {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        }

        handleIsLoanding()
    }, [isLoadingAllPrvince, isLoadingInfoUser])

    const UpdateUser = () => {
        if (email) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                notifyError("Nhập sai định dạng email")
                return
            }
        }

        if (phone) {
            const regexPhone = /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}$/;
            if (!regexPhone.test(phone)) {
                notifyError("Nhập sai định dạng số điện thoại")
                return
            }
        }

        fetch(`http://localhost:8081/v1/api/user/users/update/${JSON.parse(localStorage.user)._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                address: [address, ward, district, province].join(", ")
            })
        })
            .then(res => res.json())
            .then((data) => {
                if (data.success === false) {
                    toast.error(data.message, {
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

                toast.success("Sửa thông tin thành công", {
                    position: "top-right",
                    autoClose: 700,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            })
            .catch((e) => {
                console.log(e)
            })
    }
    return (
        <div className="mx-12">
            <ToastContainer />

            <p className="text-4xl font-bold">Thông tin tài khoản</p>
            <div className="w-full lg:w-10/12 flex flex-col gap-5 mt-10">
                <div className="flex flex-row items-center">
                    <p className="w-1/3 sm:w-1/4 font-bold ">Name</p>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000]"
                    />
                </div>
                <div className="flex flex-row items-center">
                    <p className="w-1/3 sm:w-1/4 font-bold ">Phone</p>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000]"
                    />
                </div>
                <div className="flex flex-row items-center">
                    <p className="w-1/3 sm:w-1/4 font-bold ">Email</p>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000]"
                    />
                </div>

                <div className="flex flex-row items-center">
                    <p className="w-1/3 sm:w-1/4 font-bold ">Province</p>
                    <select
                        defaultValue=""
                        className="pl-3 w-3/4 border-2 bg-[#FFFFFF] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black max-h-[50px] focus:bg-white"
                        onChange={(e) => {
                            const selectedProvince = allProvince.find(p => p.code == e.target.value)

                            if (selectedProvince) {
                                setProvince(selectedProvince.name);
                            }

                            getAllDistrictProvince(e.target.value);
                            setAllDistrict([]);
                            setAllWard([]);
                            setDistrict('');
                            setWard('');
                        }}
                    >
                        <option value="">

                        </option>
                        {
                            allProvince.map((p, index) => {
                                return (
                                    <option key={index} value={p.code}>
                                        {p.name}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className="flex flex-row items-center">
                    <p className="w-1/3 sm:w-1/4 font-bold ">District</p>
                    <select
                        defaultValue=""
                        className="pl-3 w-3/4 border-2 bg-[#FFFFFF] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black max-h-[50px] focus:bg-white"
                        onChange={(e) => {
                            const selectedDistrict = allDistrict.find(p => p.code == e.target.value)

                            if (selectedDistrict) {
                                setDistrict(selectedDistrict.name);
                            }

                            getAllWardDistrict(e.target.value)
                            setAllWard([])
                            setWard('')
                        }}
                    >
                        <option value="">

                        </option>
                        {
                            allDistrict.map((p, index) => {
                                return (
                                    <option key={index} value={p.code}>
                                        {p.name}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className="flex flex-row items-center">
                    <p className="w-1/3 sm:w-1/4 font-bold ">Ward</p>
                    <select
                        defaultValue=""
                        className="pl-3 w-3/4 border-2 bg-[#FFFFFF] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black max-h-[50px] focus:bg-white"
                        onChange={(e) => {
                            const selectedWard = allWard.find(p => p.code == e.target.value)

                            if (selectedWard) {
                                setWard(selectedWard.name);
                            }
                        }}
                    >
                        <option value="">

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
                </div>

                <div className="flex flex-row items-center">
                    <p className="w-1/3 sm:w-1/4 font-bold ">Address</p>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000]"
                    />
                </div>

                <button onClick={UpdateUser} className="w-[40%] mx-auto bg-[#A0522D] py-3 rounded-[10px] hover:bg-[#8B4513] mt-14 cursor-pointer">
                    <p className="text-lg text-center w-full text-white font-bold">Cập nhật thông tin</p>
                </button>
            </div>
        </div>

    );
}

export default AccountInfo;
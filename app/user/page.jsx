"use client"
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const AccountInfo = ({ position, select }) => {
    const provinceSelect = useRef(null)
    const districtSelect = useRef(null)
    const wardSelect = useRef(null)

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")

    const [address, setAddress] = useState('')

    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')

    const [allProvince, setAllProvince] = useState([])
    const [allDistrict, setAllDistrict] = useState([])
    const [allWard, setAllWard] = useState([])

    const [provinceCode, setProvinceCode] = useState('')
    const [districtCode, setDistrictCode] = useState('')
    const [wardCode, setWardCode] = useState('')

    //district voi ward toan vn
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    //

    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingAllPrvince, setisLoadingAllPrvince] = useState(true)
    const [isLoadingAllDistrict, setisLoadingAllDistrict] = useState(true)
    const [isLoadingAllWard, setisLoadingAllWard] = useState(true)
    const [isLoadingInfoUser, setisLoadingInfoUser] = useState(false)

    const getAllProvince = () => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then(res => res.json())
            .then(data => { setAllProvince(data) })
            .finally(() => { setisLoadingAllPrvince(false) })
    }

    const getAllDistrictProvince = async (code) => {
        if (code != '') {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
            const data = await response.json();
            setAllDistrict(data.districts);
        }
    }

    const getAllWardDistrict = async (code) => {
        if (code != '') {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
            const data = await response.json();
            setAllWard(data.wards);
        }
    }

    const getAllDistricts = () => {
        fetch("https://provinces.open-api.vn/api/d/")
            .then(res => res.json())
            .then(data => { setDistricts(data) })
            .finally(() => { setisLoadingAllDistrict(false) })
    }

    const getAllWards = () => {
        fetch("https://provinces.open-api.vn/api/w/")
            .then(res => res.json())
            .then(data => { setWards(data) })
            .finally(() => { setisLoadingAllWard(false) })
    }

    const getInfoUser = async () => {
        if (localStorage.user) {
            setisLoadingInfoUser(true);
            try {
                const response = await fetch(
                    `http://localhost:8081/v1/api/user/users/${JSON.parse(localStorage.user)._id}`
                );
                const data = await response.json();

                setName(data.name);
                setPhone(data.phone);
                setEmail(data.email);

                const [addressData, wardData, districtData, provinceData] = data.address.split(", ");
                setProvince(provinceData);
                setDistrict(districtData);
                setWard(wardData);
                setAddress(addressData);

                const province = allProvince.find(pr => pr.name === provinceData);
                await getAllDistrictProvince(province.code);

                const district = districts.find(pr => pr.name === districtData);
                await getAllWardDistrict(district.code);

                const ward = wards.find(pr => pr.name === wardData);

                setProvinceCode(province.code)
                setDistrictCode(district.code)
                setWardCode(ward.code)
            } catch (error) {
                console.log(error);
            }
            finally {
                setisLoadingInfoUser(false);
            }
        }
    }

    const updateSelect = (provinceCode, districtCode, wardCode) => {
        provinceSelect.current.value = provinceCode
        districtSelect.current.value = districtCode
        wardSelect.current.value = wardCode
    }

    useEffect(() => {
        if (!isLoading) {
            updateSelect(provinceCode, districtCode, wardCode)
        }
    }, [isLoading])

    useEffect(() => {
        getAllProvince()

        getAllDistricts()

        getAllWards()
    }, [])

    useEffect(() => {
        if (allProvince.length != 0 && districts.length != 0 && wards.length != 0) {
            getInfoUser()
        }

    }, [allProvince, districts, wards])

    useEffect(() => {
        const handleIsLoanding = () => {
            if (isLoadingAllPrvince || isLoadingInfoUser || isLoadingAllDistrict || isLoadingAllWard) {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        }

        handleIsLoanding()
    }, [isLoadingAllPrvince, isLoadingInfoUser, isLoadingAllDistrict, isLoadingAllWard])

    const UpdateUser = () => {
        if(oldPassword||newPassword||confirmNewPassword){
            if(!oldPassword){
                alert("Vui lòng nhập mật khấu cũ")
                return
            }

            if(!newPassword){
                alert("Vui lòng nhập mật khấu mới")
                return
            }

            if(!confirmNewPassword){
                alert("Vui lòng xác nhận mật khấu mới")
                return
            }

            if(newPassword != confirmNewPassword){
                alert("Mật khẩu mới và xác nhận mật khẩu mới không khớp")
                return
            }
        }

        if (email) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                alert("Nhập sai định dạng email")
                return
            }
        }

        if (phone) {
            const regexPhone = /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}$/;
            if (!regexPhone.test(phone)) {
                alert("Nhập sai định dạng số điện thoại")
                return
            }
        }

        if (province || district || ward) {
            if (province == '' || district == '' || ward == '') {
                alert("Vui lòng nhập địa chỉ")
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
                address: [address, ward, district, province].join(", "),
                oldPassword: oldPassword,
                newPassword: newPassword
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
        <>
            {!isLoading ?
                <div className="mx-12 mt-8">
                    <ToastContainer />

                    <p className="text-4xl font-bold">Account information</p>
                    <div className="w-full lg:w-10/12 flex flex-col gap-5 mt-10">
                        <div className="flex flex-row items-center">
                            <p className="w-1/3 sm:w-1/4 font-bold ">Name</p>

                            <input
                                placeholder="Enter your name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000] text-black"
                            />
                        </div>
                        <div className="flex flex-row items-center">
                            <p className="w-1/3 sm:w-1/4 font-bold ">Phone</p>
                            <input
                                type="text"
                                placeholder="Enter your phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000] text-black"
                            />
                        </div>
                        <div className="flex flex-row items-center">
                            <p className="w-1/3 sm:w-1/4 font-bold ">Email</p>
                            <input
                                type="text"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000] text-black"
                            />
                        </div>

                        <div className="flex flex-row items-center">
                            <p className="w-1/3 sm:w-1/4 font-bold ">Old password</p>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000] text-black"
                            />
                        </div>

                        <div className="flex flex-row items-center">
                            <p className="w-1/3 sm:w-1/4 font-bold ">New password</p>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000] text-black"
                            />
                        </div>

                        <div className="flex flex-row items-center">
                            <p className="w-1/3 sm:w-1/4 font-bold ">Confirm new password</p>
                            <input
                                type="password"
                                placeholder="Enter confirm password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000] text-black"
                            />
                        </div>

                        <div className="flex flex-row items-center">
                            <p className="w-1/3 sm:w-1/4 font-bold ">Province</p>
                            <select
                                ref={provinceSelect}
                                defaultValue=""
                                className="pl-3 w-3/4 border-2 bg-[#FFFFFF] border-gray-300 text-gray-900 rounded-lg focus:ring-black focus:border-black block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black max-h-[50px] focus:bg-white"
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
                                ref={districtSelect}
                                defaultValue=""
                                className="pl-3 w-3/4 border-2 bg-[#FFFFFF] border-gray-300 text-gray-900 rounded-lg focus:ring-black focus:border-black block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black max-h-[50px] focus:bg-white"
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
                                ref={wardSelect}
                                defaultValue=""
                                className="pl-3 w-3/4 border-2 bg-[#FFFFFF] border-gray-300 text-gray-900 rounded-lg focus:ring-black focus:border-black block p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black max-h-[50px] focus:bg-white"
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
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="pl-3 w-3/4 h-[45px] border border-gray-300 rounded-lg focus:ring-[#000] focus:outline-[#000] text-black"
                            />
                        </div>

                        <button onClick={UpdateUser} className="w-[40%] mx-auto bg-[#A0522D] py-3 rounded-[10px] hover:bg-[#8B4513] mt-14 cursor-pointer">
                            <p className="text-lg text-center w-full text-white font-bold">Cập nhật thông tin</p>
                        </button>
                    </div>
                </div>
                :
                <></>
            }
        </>
    );
}

export default AccountInfo;
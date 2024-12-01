"use client"
import React, { useContext, useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import { Images } from "@/data/poster";
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";
import { AppContext } from "@/context/AppContext";
import { useRouter } from 'next/navigation'
const Login = () => {
    const {signup, setErrorSignup, signin} = useContext(AppContext)
    const router = useRouter()
    const [isSignUp, setIsSignUp] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleGlobalKeyDown = async (event) => {
        if (event?.key === 'Enter') {
            if (isSignUp) {
                await handleSignup(firstName + " " + lastName, email, address, phoneNumber, password)
            } else {
                await handleSignin(email, password)
            }
        }
    }

    useEffect(() => {
        setErrorSignup(null)
    }, [setErrorSignup])

    useEffect(() => {
        window.addEventListener('keydown', handleGlobalKeyDown)
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown)
        }
    }, [isSignUp, email, password, firstName, lastName, address, phoneNumber, handleGlobalKeyDown])

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

    const notifySuccess = (message, navigate) => {
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
                router.push(navigate)
            }
        })
    }

    const handleSignup = async (name, email, address, phoneNumber, password) => {
        if (!firstName) {
            notifyError('Please enter your first name')
            return
        }
        if (!lastName) {
            notifyError('Please enter your last name')
            return
        }
        if (!email) {
            notifyError('Please enter your email')
            return
        }
        if (!address) {
            notifyError('Please enter your address')
            return
        }
        if (!phoneNumber) {
            notifyError('Please enter your phone number')
            return
        }
        if (!password) {
            notifyError('Please enter your password')
            return
        }
        const res = await signup(firstName + " " + lastName, email, address, phoneNumber, password)
        if (res.success) {
            localStorage.setItem('token', res.accessToken)
            localStorage.setItem('user', JSON.stringify(res.user))
            notifySuccess("Đăng ký thành công", '/menu')
        } else {
            if (res.type?.message==='Validation Error') {
                notifyError(res.errors[0].message)
                return
            }else {
                notifyError(res.message)
            }
        }
    }

    const handleSignin = async (email, password) => {
        if (!email) {
            notifyError('Please enter your email')
            return
        }
        if (!password) {
            notifyError('Please enter your password')
            return
        }

        const res = await signin(email, password)
        if (!res.success) {
            notifyError(res.message)
            return
        }
        localStorage.setItem('token', res.accessToken)
        localStorage.setItem('user', JSON.stringify(res.user))
        notifySuccess("Đăng nhập thành công", '/home')
    }

    return (
        <div className="h-full w-[95%] md:w-[85%] lg:w-[70%] flex flex-col md:flex-row p-2 md:p-4 gap-2.5 bg-[#4C2113] rounded-[15px] m-auto mt-5">
            <ToastContainer />
            <Swiper
                modules={[Pagination, A11y, Autoplay]}
                pagination={{
                    dynamicBullets: true,
                    clickable: true,
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                className="w-full md:w-[40%] cursor-pointer"
                slidesPerView={1}
                loop={true}
            >
                {Images.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <Image
                                src={item.path}
                                className="w-full h-full rounded-[15px] object-cover"
                                width={item.width}
                                height={item.height}
                                priority
                                alt={item.alt}
                            />
                            <Link
                                href="/menu"
                            >
                                <p className="absolute top-[2px] right-[10px] bg-[rgba(100,88,158,0.7)] text-white px-[10px] py-[5px] rounded-[5px] no-underline transition-colors duration-300">Back to Website →</p>
                            </Link>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className="w-full md:w-[60%] px-[15px] md:px-[50px] py-[20px] text-black bg-white text-center rounded-[15px]">
                <div className="p-[5px]">
                    <h2 className="text-[24px] md:text-[30px]">Welcome Back</h2>
                    <p className="text-sm md:text-base">Welcome Back to Our Website, Please enter Your details Informations</p>
                    <div className="flex justify-center mb-[20px] mx-auto w-full md:w-[70%]">
                        <button
                            type="button"
                            className={`flex-1 p-[10px] cursor-pointer border rounded-tl-[5px] rounded-bl-[5px] transition-all duration-400 ease-in-out ${!isSignUp ? 'bg-[#B38B60] border-black' : 'border-[#ddd] bg-[#f0f0f0]'}`}
                            onClick={() => setIsSignUp(false)}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`flex-1 p-[10px] cursor-pointer border rounded-tr-[5px] rounded-br-[5px] transition-all duration-400 ease-in-out ${isSignUp ? 'bg-[#B38B60] border-black' : 'border-[#ddd] bg-[#f0f0f0]'}`}
                            onClick={() => setIsSignUp(true)}
                        >
                            Signup
                        </button>
                    </div>
                </div>
                {isSignUp ? (
                    <div>
                        <div className="rounded-[8px] text-center w-[95%] md:w-[85%] mx-auto shadow-lg">
                            <div className="mb-[15px] flex flex-col md:flex-row gap-[10px] md:gap-[20px]">
                                <input
                                    type="text"
                                    className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    type="email"
                                    className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    type="email"
                                    className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                    placeholder="Enter your phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    type="address"
                                    className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    type="password"
                                    className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {/* <div className="form-group terms">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    // checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    required    
                                />
                                <label htmlFor="terms">
                                    I agree to the <a href="/terms">Terms & Conditions</a>
                                </label>
                            </div> */}
                            {/* {errorSignup && <div>{errorSignup}</div>} */}
                            <button type="submit" className="w-full p-[10px] border-none rounded-[4px] bg-[#8B4513] text-white text-[16px] cursor-pointer hover:bg-[#A0522D]"
                                    onClick={() => handleSignup(firstName + " " + lastName, email, address, phoneNumber, password)}>Sign up</button>
                        </div>
                        <div className="flex flex-col items-center w-[95%] md:w-[85%] my-[20px] mx-auto">
                            <div className="flex items-center w-full mb-[20px]">
                                <span className="flex-1 h-[1px] bg-[#a1a1a1]"></span>
                                <div className="mx-[10px] text-[#a1a1a1] text-[14px]">Or register with</div>
                                <span className="flex-1 h-[1px] bg-[#a1a1a1]"></span>
                            </div>    
                            <div className="flex justify-around w-full flex-col md:flex-row gap-2 md:gap-0">
                                <button className="w-full md:w-[45%] p-[10px] border-none rounded-[4px] cursor-pointer text-[16px] text-white bg-[#db4437] hover:bg-[#c33d2e]">Google</button>
                                <button className="w-full md:w-[45%] p-[10px] border-none rounded-[4px] cursor-pointer text-[16px] text-white bg-[#1977f3] hover:bg-[#0469f0]">Facebook</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-[8px] text-center w-[95%] md:w-[85%] mx-auto shadow-lg">
                        <div className="mb-[20px]">
                            <input
                                type="email"
                                className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-[15px]">
                            <input
                                type="password"
                                className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full p-[10px] border-none rounded-[4px] bg-[#8B4513] text-white text-[16px] cursor-pointer hover:bg-[#A0522D]"
                                onClick={() => handleSignin(email, password)}>Sign in</button>
                    </div>
                )}
            </div>  

            <style jsx global>{`
                .swiper-pagination-bullet {
                    background-color: #534c5b;
                    opacity: 1;
                    width: 30px;
                    height: 5px;
                    margin: 0 5px;
                    border-radius: 4px;
                }

                .swiper-pagination-bullet-active {
                    background-color: #ededed;
                }
            `}</style> 
        </div>
    )
}

export default Login
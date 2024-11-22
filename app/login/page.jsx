"use client"
import React, { useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import { Images } from "@/data/poster";
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="h-full w-[70%] flex flex-row p-4 gap-2.5 bg-[#4C2113] rounded-[15px] m-auto">
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
                className="w-[40%] rounded-[15px]"
                slidesPerView={1}
                loop={true}
            >
                {Images.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <Image
                                src={item.path}
                                layout="fixed"
                                className="w-full h-full rounded-[15px] object-cover"
                                width={item.width}
                                height={item.height}
                                priority
                                alt={item.alt}
                            />
                            <Link
                                href="/menu"
                                className="link-back"
                            >
                                <p className="absolute top-[2px] right-[10px] bg-[rgba(100,88,158,0.7)] text-white px-[10px] py-[5px] rounded-[5px] no-underline transition-colors duration-300">Back to Website →</p>
                            </Link>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className="w-[60%] px-[50px] py-[20px] text-black bg-white text-center">
                <div className="p-[5px] mb-[20px]">
                    <h2 className="text-[30px]">Welcome Back</h2>
                    <p>Welcome Back to Our Website, Please enter Your details Informations</p>
                    <div className="flex justify-center mb-[20px] mx-auto w-[70%]">
                        <button
                            type="button"
                            className={`flex-1 p-[10px] cursor-pointer bg-[#f0f0f0] border rounded-tl-[5px] rounded-bl-[5px] transition-all duration-300 ease-in-out ${!isSignUp ? 'bg-[#B38B60] border-black' : 'border-[#ddd]'}`}
                            onClick={() => setIsSignUp(false)}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`flex-1 p-[10px] cursor-pointer bg-[#f0f0f0] border rounded-tr-[5px] rounded-br-[5px] transition-all duration-300 ease-in-out ${isSignUp ? 'bg-[#B38B60] border-black' : 'border-[#ddd]'}`}
                            onClick={() => setIsSignUp(true)}
                        >
                            Signup
                        </button>
                    </div>
                </div>
                <div className="rounded-[8px] text-center w-[85%] mx-auto shadow-lg">
                    <div className="mb-[20px] flex gap-[20px]">
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
                    <div className="mb-[20px]">
                        <input
                            type="email"
                            className="w-full p-[10px] mb-[10px] border-2 border-gray-500 rounded-[4px] text-[16px]"
                            placeholder="Email/Phone Number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-[20px]">
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
                    <button type="submit" className="w-full p-[10px] border-none rounded-[4px] bg-[#8B4513] text-white text-[16px] cursor-pointer hover:bg-[#A0522D]">Sign up</button>
                </div>
                <div className="flex flex-col items-center w-[85%] my-[20px] mx-auto">
                    <div className="flex items-center w-full mb-[20px]">
                        <span className="flex-1 h-[1px] bg-[#a1a1a1]"></span>
                        <div className="mx-[10px] text-[#a1a1a1] text-[14px]">Or register with</div>
                        <span className="flex-1 h-[1px] bg-[#a1a1a1]"></span>
                    </div>    
                    <div className="flex justify-around w-full">
                        <button className="w-[45%] p-[10px] border-none rounded-[4px] cursor-pointer text-[16px] text-white bg-[#db4437] hover:bg-[#c33d2e]">Google</button>
                        <button className="w-[45%] p-[10px] border-none rounded-[4px] cursor-pointer text-[16px] text-white bg-[#1977f3] hover:bg-[#0469f0]">Facebook</button>
                    </div>
                </div>
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
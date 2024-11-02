'use client'

import React from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import { Images } from "@/data/poster";
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import './test.css'

const Login = () => {

    return (
        <div className="main">
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
                className="my-swiper"
                slidesPerView={1}
                loop={true}
            >
                {Images.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <Image
                                src={item.path}
                                width={item.width}
                                height={item.height}
                                className="slide-image"
                                alt={item.alt}
                            />
                            <Link
                                href="/testPage"
                                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                            >
                                <p className="back-to-website" style={{backgroundColor: "#64589e", opacity: 0.7}}>Back to Website →</p>
                            </Link>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className="login-form">
                <button className="btn-primary">Add to Cart</button>
                <button className="btn-secondary">Buy Now</button>
            </div>        
        </div>
    )
}

export default Login
"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "@/components/scrollToTop";

export default function Page() {
    useEffect(() => {
        Aos.init({
          duration: 1000,
          disable: "mobile",
          once: true,
        })
    }, [])

    return (
        <div className="container mx-auto py-10 px-4 mt-4">
            <h2 className="text-4xl font-semibold text-center text-[#8B4513] mb-6" data-aos="fade-up">  
                Welcome to Caffeine Corner
            </h2>
            <div className="relative py-16 px-4 lg:px-20 flex items-center">
                <div className="lg:flex lg:items-center lg:space-x-16">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold text-[#8B4513] mb-6" data-aos="fade-up">
                            Caffeine Corner
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up" data-aos-delay="200">
                            Welcome to Caffeine Corner - the place that brings you the best coffee and beverage enjoyment experiences. With the mission of bringing relaxation and energy to every day, we are proud to provide quality products, from selected coffee beans to creative and diverse drinks.

                        </p>
                        <Link
                            href={"/menu"}
                        >
                            <p className="inline-block py-2 px-6 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]" data-aos="fade-up" data-aos-delay="400">XEM CHI TIẾT</p>
                        </Link>
                    </div>

                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <Image
                            src="/cf_introduce.jpg"
                            alt="Giới thiệu"
                            className="rounded-lg shadow-lg"
                            width={500}
                            height={300}
                            priority
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            data-aos="zoom-in"
                        />
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-semibold text-[#8B4513] mb-6 text-center" data-aos="fade-up">
                Statement
            </h2>
            <p className="text-center text-xl mb-6 italic" data-aos="fade-up">
                <strong>&quot;Awaken inspiration and create connection through each cup of coffee - where each flavor tells a story, and each moment becomes a memory
                &quot;.</strong>
            </p>

            <div className="relative py-16 px-4 lg:px-20 flex items-center">
                <div className="lg:flex lg:items-center lg:space-x-16">
                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <Image
                            src="/my_cf.jpg"
                            alt="Hạt cà phê"
                            className="rounded-lg shadow-lg"
                            width={500}
                            height={300}
                            priority
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            data-aos="zoom-in"
                        />
                    </div>
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold text-[#8B4513] mb-6" data-aos="fade-up">
                            Our Products
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up">
                        At Caffeine Corner, we not only focus on quality but also on the origin and production process of each drink. We are always looking for drinks with unique flavors, the best products, safe for health and produced in an environmentally responsible way. Every cup of coffee, every glass of water goes through a strict testing process to ensure you get comfort, purity and refreshment in every sip.

                        </p>
                    </div>
                </div>
            </div>

            <div className="relative py-16 px-4 lg:px-20 flex items-center">
                <div className="lg:flex lg:items-center lg:space-x-16">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold text-[#8B4513] mb-6" data-aos="fade-up">
                            Our customers
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up">
                            We focus on connecting with customers, creating meaningful moments through genuine communication and smiles. Our desire is not only to provide quality products, but also to enhance our customers' experiences and lives every time they come to us. We believe that it is human connection that truly creates different value.
                        </p>
                    </div>

                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <Image
                            src="/customer_cf.jpg"
                            alt="Khách hàng cà phê"
                            className="rounded-lg shadow-lg"
                            width={500}
                            height={300}
                            priority
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            data-aos="zoom-in"
                        />
                    </div>
                </div>
            </div>

            <div className="relative py-16 px-4 lg:px-20 flex items-center">
                <div className="lg:flex lg:items-center lg:space-x-16">
                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <Image
                            src="/view_cf.jpg"
                            alt="Cửa hàng cà phê"
                            className="rounded-lg shadow-lg"
                            width={500}
                            height={300}
                            priority
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            data-aos="zoom-in"
                        />
                    </div>
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold text-[#8B4513] mb-6" data-aos="fade-up">
                            Our store
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up">
                            We promise that the store will be a destination for people with the same passion for enjoying coffee, creating a cozy and intimate space where customers can find peace and comfort. Our store is not just a place to enjoy a drink, but also a place for you to meet friends, relax, and enjoy moments at your own pace – whether slow or fast. Every moment at the store is filled with humanity and sincere connection.
                        </p>
                    </div>
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
}

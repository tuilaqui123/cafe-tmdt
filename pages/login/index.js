'use client'

import React, { useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import { Images } from "@/data/poster";
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import './index.css'

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="container">
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
                className="swiper-container"
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
                                className="link-back"
                            >
                                <p className="back-to-website">Back to Website →</p>
                            </Link>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className="form-container">
                <div className="form-header">
                    <h2 className="form-greeting">Welcome Back</h2>
                    <p>Welcome Back to Our Website, Please enter Your details Informations</p>
                    <div className="form-toggle">
                        <button
                            type="button"
                            className={`toggle-btn ${!isSignUp ? 'enable' : ''}`}
                            onClick={() => setIsSignUp(false)}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`toggle-btn ${isSignUp ? 'enable' : ''}`}
                            onClick={() => setIsSignUp(true)}
                        >
                            Signup
                        </button>
                    </div>
                </div>
                <div className="form-body">
                    <div className="form-input name-group">
                        <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type="email"
                            placeholder="Email/Phone Number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-input">
                        <input
                            type="password"
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
                    <button type="submit" className="signup-button">Sign up</button>
                </div>
                <div className="form-footer">
                    <div className="form-separator">
                        <span className="horizontal-line"></span>
                        <div className="register-text">Or register with</div>
                        <span className="horizontal-line"></span>
                    </div>    
                    <div className="social-signup">
                        <button className="google-btn">Google</button>
                        <button className="facebook-btn">Facebook</button>
                    </div>
                </div>
            </div>   
        </div>
    )
}

export default Login
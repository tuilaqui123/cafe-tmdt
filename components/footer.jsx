import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRegCopyright } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-[#4c2113] text-white mt-5">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
                        <p className="text-gray-300">
                        Chúng tôi đam mê phục vụ những ly cà phê hảo hạng nhất và tạo nên những trải nghiệm đáng nhớ cho khách hàng của mình.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <FaFacebook size={24} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <FaTwitter size={24} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <FaInstagram size={24} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Các liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/home" className="text-gray-300 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="text-gray-300 hover:text-white transition-colors">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                                    Về chúng tôi
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <FaPhone className="text-gray-300" />
                                <span className="text-gray-300">+84 123 456 789</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <FaEnvelope className="text-gray-300" />
                                <span className="text-gray-300"><a href='mailto:21520419@gm.uit.edu.vn'>21520419@gm.uit.edu.vn</a></span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-gray-300" />
                                <span className="text-gray-300">UIT</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Giờ mở cửa</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-300">Thứ 2 - Thứ 6</li>
                            <li className="text-white font-semibold">7:00 AM - 10:00 PM</li>
                            <li className="text-gray-300 mt-2">Thứ 7 - Chủ nhât</li>
                            <li className="text-white font-semibold">8:00 AM - 11:00 PM</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-300 flex items-center justify-center gap-2">
                        <FaRegCopyright className="text-gray-300" />
                        <span>{new Date().getFullYear()} Caffeine Corner. Đã đăng ký bản quyền</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
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
                Chào mừng bạn đến với Coffee Shop
            </h2>
            <div className="relative py-16 px-4 lg:px-20 flex items-center">
                <div className="lg:flex lg:items-center lg:space-x-16">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold text-[#8B4513] mb-6" data-aos="fade-up">
                            GIỚI THIỆU
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up" data-aos-delay="200">
                            Chào mừng bạn đến với Coffee Shop - nơi mang đến cho bạn những trải nghiệm thưởng thức đồ uống và cà phê tuyệt vời nhất. Với sứ mệnh mang lại không gian thư giãn và năng lượng cho mỗi ngày, chúng tôi tự hào cung cấp những sản phẩm chất lượng, từ những hạt cà phê chọn lọc đến các loại đồ uống sáng tạo và đa dạng.
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
                Tuyên bố về sứ mệnh
            </h2>
            <p className="text-center text-xl mb-6 italic" data-aos="fade-up">
                <strong>&quot;Khơi dậy niềm cảm hứng và tạo nên sự gắn kết qua từng tách cà phê - nơi mỗi hương vị kể một câu chuyện, và mỗi khoảnh khắc trở thành kỷ niệm&quot;.</strong>
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
                            Cà phê của chúng tôi
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up">
                            Tại Coffee Shop, chúng tôi không chỉ tập trung vào chất lượng mà còn chú trọng đến nguồn gốc và quy trình sản xuất của mỗi loại nước uống. Chúng tôi vẫn luôn tìm kiếm những thức uống có hương vị độc đáo, những sản phẩm tốt nhất, an toàn cho sức khỏe và được sản xuất theo cách có trách nhiệm với môi trường. Mỗi tách cà phê, mỗi ly nước đều trải qua quy trình kiểm tra nghiêm ngặt để đảm bảo mang đến cho bạn sự thoải mái, tinh khiết và sảng khoái trong từng ngụm nước.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative py-16 px-4 lg:px-20 flex items-center">
                <div className="lg:flex lg:items-center lg:space-x-16">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold text-[#8B4513] mb-6" data-aos="fade-up">
                            Khách hàng của chúng tôi
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up">
                            Chúng tôi tập trung vào việc kết nối với khách hàng, tạo ra những khoảnh khắc ý nghĩa thông qua sự giao tiếp và nụ cười chân thành. Mong muốn của chúng tôi không chỉ là cung cấp sản phẩm chất lượng, mà còn là nâng cao trải nghiệm và cuộc sống của khách hàng mỗi khi họ đến với chúng tôi. Chúng tôi tin rằng chính sự kết nối con người mới thực sự làm nên giá trị khác biệt.
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
                            Cửa hàng của chúng tôi
                        </h2>
                        <p className="text-xl text-gray-700 mb-6" data-aos="fade-up">
                            Chúng tôi hứa hẹn cửa hàng sẽ là điểm đến hội tụ những người có cùng đam mê thưởng thức cà phê, tạo nên một không gian ấm cúng và gần gũi, nơi mà khách hàng có thể tìm thấy sự bình yên và thoải mái. Cửa hàng của chúng tôi không chỉ là nơi thưởng thức đồ uống, mà còn là nơi để bạn gặp gỡ bạn bè, thư giãn, và tận hưởng những khoảnh khắc theo nhịp sống của riêng mình – dù là chậm rãi hay nhanh chóng. Mỗi khoảnh khắc tại cửa hàng đều mang đậm tính nhân văn và sự kết nối chân thành.
                        </p>
                    </div>
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
}

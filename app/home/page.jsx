"use client"
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/AppContext'
import Image from 'next/image'
import Link from 'next/link'
// import { motion } from 'framer-motion'
import { FaCoffee, FaLeaf, FaMugHot } from 'react-icons/fa'

const Home = () => {
    const { products, categories } = useContext(AppContext)
    const [featuredProducts, setFeaturedProducts] = useState([])

    useEffect(() => {
        setFeaturedProducts(products.slice(0, 8))
    }, [products])

    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number)
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[600px]">
                <Image
                    src="https://res.cloudinary.com/djbelaeen/image/upload/v1732295812/Cafe/Product/tztc09hvn438b5fxtp44.png"
                    alt="Coffee Shop Hero"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                        {/* <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold mb-4"
                        >
                            Welcome to Our Coffee Shop
                        </motion.h1> */}
                        <p className="text-xl mb-8">Discover the perfect blend for your day</p>
                        <Link href="/menu">
                            <button className="bg-[#A0522D] hover:bg-[#8B4513] text-white px-8 py-3 rounded-full transition-colors">
                                View Menu
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-[#FDF5E6]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <FaCoffee className="mx-auto text-4xl text-[#A0522D] mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Premium Beans</h3>
                            <p className="text-gray-600">Carefully selected coffee beans from around the world</p>
                        </div>
                        <div className="text-center">
                            <FaLeaf className="mx-auto text-4xl text-[#A0522D] mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
                            <p className="text-gray-600">100% organic ingredients for the best taste</p>
                        </div>
                        <div className="text-center">
                            <FaMugHot className="mx-auto text-4xl text-[#A0522D] mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Perfect Brew</h3>
                            <p className="text-gray-600">Expertly crafted by our skilled baristas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#A0522D] font-bold">
                                            {formatNumber(product.type[0].price)}đ
                                        </span>
                                        <Link href={`/menu/${product._id}`}>
                                            <button className="bg-[#A0522D] text-white px-4 py-2 rounded hover:bg-[#8B4513] transition-colors">
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))} */}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="py-16 bg-[#FDF5E6]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* {categories.map((category, index) => (
                            <motion.div
                                key={category._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer hover:shadow-xl transition-shadow"
                            >
                                <h3 className="text-xl font-semibold mb-2">{category._id}</h3>
                                <p className="text-gray-600">{category.products.length} products</p>
                            </motion.div> 
                        ))} */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
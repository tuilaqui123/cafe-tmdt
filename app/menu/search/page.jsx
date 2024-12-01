"use client";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import CardItem1 from "@/components/cardItem1";
import { TiDelete } from "react-icons/ti";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

export default function SearchPage() {
    const searchParams = useSearchParams()
    const { products } = useContext(AppContext)
    const [searchResults, setSearchResults] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState(null)
    const PRODUCTS_PER_PAGE = 12

    const query = searchParams.get("keyword")

    useEffect(() => {
        if (query) {
        const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.description.toLowerCase().includes(query.toLowerCase()) || product.categoryId.name.toLowerCase().includes(query.toLowerCase()))
        setSearchResults(filteredProducts)
        setCurrentPage(1)
        }
    }, [query, products])

    const availableProducts = searchResults.filter((product) => product.isStock)
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE
    const currentProducts = availableProducts.slice(indexOfFirstProduct,indexOfLastProduct)
    const totalPages = Math.ceil(availableProducts.length / PRODUCTS_PER_PAGE)

    const handleImageClick = (imageUrl, index) => {
        setSelectedImage(imageUrl)
        setSelectedImageIndex(index)
    }

    const handleClosePopup = () => {
        setSelectedImage(null)
        setSelectedImageIndex(null)
    }

    const handlePrevImage = (e) => {
        e.stopPropagation()
        if (selectedImageIndex > 0) {
        setSelectedImage(currentProducts[selectedImageIndex - 1].image)
        setSelectedImageIndex(selectedImageIndex - 1)
        }
    }

    const handleNextImage = (e) => {
        e.stopPropagation()
        if (selectedImageIndex < currentProducts.length - 1) {
        setSelectedImage(currentProducts[selectedImageIndex + 1].image)
        setSelectedImageIndex(selectedImageIndex + 1)
        }
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
            Search Results for "{query}"
            </h1>

            {searchResults.length === 0 ? (
            <div className="text-center py-8">
                <p className="text-xl text-gray-600">
                No products found matching your search.
                </p>
            </div>
            ) : (
            <>
                <p className="mb-4 text-gray-600">
                Found {searchResults.length} products
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {currentProducts.map((product, index) => (
                    <div key={index}>
                    <CardItem1
                        id={product._id}
                        image={product.image}
                        name={product.name}
                        description={product.description}
                        discount={product.discount}
                        type={product.type}
                        handleImageClick={() =>
                        handleImageClick(product.image, index)
                        }
                    />
                    </div>
                ))}
                </div>

                {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={handleClosePopup}
                >
                    <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
                    <button
                        className="absolute top-0 right-0 m-4 text-black hover:text-red-500 z-10"
                        onClick={handleClosePopup}
                    >
                        <TiDelete className="text-5xl" />
                    </button>

                    {selectedImageIndex > 0 && (
                        <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black hover:text-red-500 z-10 rounded-full p-2 shadow-lg transition-colors"
                        onClick={handlePrevImage}
                        >
                        <FaChevronLeft className="text-2xl" />
                        </button>
                    )}

                    {selectedImageIndex < currentProducts.length - 1 && (
                        <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-red-500 z-10 rounded-full p-2 shadow-lg transition-colors"
                        onClick={handleNextImage}
                        >
                        <FaChevronRight className="text-2xl" />
                        </button>
                    )}

                    <div
                        className="relative w-full h-full flex items-center justify-center bg-white rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                        src={selectedImage}
                        alt="Enlarged product"
                        className="object-contain max-h-[90vh] rounded-lg"
                        width={800}
                        height={800}
                        priority
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-gray-600">
                        {selectedImageIndex + 1} / {currentProducts.length}
                    </div>
                    </div>
                </div>
                )}

                {totalPages > 1 && (
                <div div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#A0522D] text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        {i + 1}
                    </button>
                    ))}
                </div>
                )}
            </>
            )}
        </div>
        </div>
    )
}
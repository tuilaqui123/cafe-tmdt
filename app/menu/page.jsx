"use client"
import CardItem1 from "@/components/cardItem1";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Page() {
  const router = useRouter()
  const {products, categories, getCategoríes} = useContext(AppContext)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [selectCategoryProducts, setSelectedCategoryProducts] = useState([])
  const [selectCategory, setSelectCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const PRODUCT_PER_PAGE = 12
  
  const availableProducts = products.filter(product => product.isStock)
  const availableCategoryProducts = selectCategoryProducts.filter(product => product.isStock)

  const indexOfLastProduct = currentPage * PRODUCT_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - PRODUCT_PER_PAGE
  const currentProducts = selectCategoryProducts.length === 0 ? availableProducts.slice(indexOfFirstProduct, indexOfLastProduct) : availableCategoryProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil((selectCategoryProducts.length === 0 ? availableProducts.length : availableCategoryProducts.length) / PRODUCT_PER_PAGE)
  
  const handleCategoryChange = (category) => {
    const categoryPath = category.name.toLowerCase().replace(/\s+/g, '-')
    setSelectCategory(category.name)

    router.push(`/menu/category/${categoryPath}`)
  }

  const toggleCategoryVisibility = () => setIsCategoryOpen((prev) => !prev)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
  useEffect(() => {
    getCategoríes()
  }, [])

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

  return (
    <div className="w-full flex">
      <div className="w-[75%] flex flex-col gap-5 ml-3">
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
                handleImageClick={() => handleImageClick(product.image, index)}
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
                <TiDelete className="text-5xl"/>
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

        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#A0522D] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="w-[25%] px-4">
        <div className="category-section">
          <div className="flex justify-between items-center cursor-pointer mb-2"
               onClick={toggleCategoryVisibility}
          >
            <span className="text-xl font-bold">Category</span>
            <span 
              className={`text-2xl flex items-center transform transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : "rotate-0"}`}
            >
              <IoIosArrowDown />
            </span>
          </div>  
          <ul className={`transition-all duration-500 ease-in-out overflow-hidden ${isCategoryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} space-y-3`}>
            {isCategoryOpen && categories.map((category, index) => (
              <li
                key={index}
                className={`cursor-pointer px-3 py-2 shadow rounded-md transition ${selectCategory===category._id ? "bg-[#8B4513] text-white hover:bg-[#A0522D]" : "bg-white hover:bg-gray-200 "}`}
                onClick={() => handleCategoryChange(category)}
              >
                <p className="capitalize">{category.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
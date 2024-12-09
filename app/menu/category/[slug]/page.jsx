"use client"
import { useContext, useEffect, useState, use } from "react";
import { AppContext } from "@/context/AppContext";
import CardItem1 from "@/components/cardItem1";
import { IoIosArrowUp } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CategoryPage({ params }) {
  const router = useRouter()
  const { categories, getCategoryByName } = useContext(AppContext)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const PRODUCTS_PER_PAGE = 12
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const slug = use(params).slug

  useEffect(() => {
    const handleGetCategoryByName = async (slug) => {
      setIsLoading(true)
      const formattedCate = slug.replace(/-/g, ' ')
      const result =  await getCategoryByName(formattedCate)
      const categoryId = result._id
      const category = categories.find(ele => ele._id.toLowerCase() === categoryId.toLowerCase())
      
      if (category) {
        const productsArray = Array.isArray(category.products) ? category.products : []
        setCategoryProducts(productsArray)
        setActiveCategory(category._id)
        setCurrentPage(1)
      } else {
        setCategoryProducts([])
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
    handleGetCategoryByName(slug)
  }, [categories, slug])

  const availableCategoryProducts = categoryProducts.filter(product => product.isStock)

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE
  const currentProducts = availableCategoryProducts.length > 0 ? availableCategoryProducts.slice(indexOfFirstProduct, indexOfLastProduct) : []
  const totalPages = Math.ceil(availableCategoryProducts.length / PRODUCTS_PER_PAGE)
  
  const handleCategoryChange = (category) => {
    const categoryPath = category.name.toLowerCase().replace(/\s+/g, '-')
    setActiveCategory(category._id)
    if (categoryPath === slug) {
      router.push('/menu', {shallow: true})
    } else {
      router.push(`/menu/category/${categoryPath}`, {
        shallow: true,
        scroll: false
      })
    }
  }

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
    <div className="w-full flex mt-5 p-10">
      <div className="w-[25%] px-4">
        <div className="category-section">
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="text-xl font-bold">Danh mục</span>
            <span className={`text-2xl flex items-center transform transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : "rotate-0"}`}>
              <IoIosArrowUp />
            </span>
          </div>
          <ul className={`transition-all duration-500 ease-in-out overflow-hidden ${isCategoryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} space-y-3`}>
            {isCategoryOpen && categories.map((category, index) => (
              <li
                key={index}
                className={`cursor-pointer px-3 py-2 shadow rounded-md transition ${activeCategory === category._id ? "bg-[#8B4513] text-white hover:bg-[#A0522D]" : "bg-white hover:bg-gray-200"}`}
                onClick={() => handleCategoryChange(category)}
              >
                <p className="capitalize">{category.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-[75%] flex flex-col gap-5 ml-3">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded mt-2"></div>
                <div className="h-4 bg-gray-200 rounded mt-2 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((product, index) => (
              <CardItem1 
                key={product._id || index}
                id={product._id}
                image={product.image}
                name={product.name}
                description={product.description}
                discount={product.discount}
                type={product.type}
                handleImageClick={() => handleImageClick(product.image, index)}
              />
            ))}
          </div>
        )}

        {!isLoading && availableCategoryProducts.length > 0 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#A0522D] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
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
    </div>
  );
}
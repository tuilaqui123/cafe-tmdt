"use client"
import CardItem1 from "@/components/cardItem1";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { IoIosArrowUp } from "react-icons/io";

export default function Page() {
  const {products, categories, getCategoríes} = useContext(AppContext)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [selectCategoryProducts, setSelectedCategoryProducts] = useState([])
  const [selectCategory, setSelectCategory] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const PRODUCT_PER_PAGE = 12

  const indexOfLastProduct = currentPage * PRODUCT_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCT_PER_PAGE;
  const currentProducts = selectCategoryProducts.length === 0 ? products.slice(indexOfFirstProduct, indexOfLastProduct) : selectCategoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil((selectCategoryProducts.length === 0 ? products.length : selectCategoryProducts.length) / PRODUCT_PER_PAGE)

  const handleCategoryChange = (category) => {
    if (selectCategory === category._id) {
      setSelectCategory(null)
      setSelectedCategoryProducts([])
    } else {
      setSelectCategory(category._id)
      setSelectedCategoryProducts(category.products)
    }
    setCurrentPage(1)
  }

  const toggleCategoryVisibility = () => setIsCategoryOpen((prev) => !prev)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    getCategoríes()
  }, [])

  return (
    <div className="w-full flex">
      <div className="w-[75%] flex flex-col gap-5 ml-3">
        <div className="grid grid-cols-4 gap-5">
          {currentProducts.map((product, index) => (
            <CardItem1 
              key={index} 
              id={product._id}
              image={product.image} 
              name={product.name}
              description={product.description}
              discount={product.discount}
              type={product.type}
            />
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-[#A0522D] text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
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
              <IoIosArrowUp />
            </span>
          </div>  
          {(
            <ul className={`transition-all duration-500 ease-in-out overflow-hidden ${isCategoryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} space-y-3`}>
              {isCategoryOpen && categories.map((category, index) => (
                <li
                  key={index}
                  className={`cursor-pointer px-3 py-2 shadow rounded-md transition ${selectCategory===category._id ? "bg-[#8B4513] text-white hover:bg-[#A0522D]" : "bg-white hover:bg-gray-200 "}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  <p>{category._id}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
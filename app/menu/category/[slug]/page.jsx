"use client"
import { useContext, useEffect, useState, use } from "react";
import { AppContext } from "@/context/AppContext";
import CardItem1 from "@/components/cardItem1";
import { IoIosArrowUp } from "react-icons/io";
import { useRouter } from 'next/navigation';

export default function CategoryPage({ params }) {
  const router = useRouter()
  const { categories } = useContext(AppContext)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const PRODUCTS_PER_PAGE = 12

  const slug = use(params).slug

  useEffect(() => {
    const categoryId = slug.split('-').join(' ').toUpperCase()
    const category = categories.find(ele => ele._id.toLowerCase() === categoryId.toLowerCase())
    if (category) {
      setCategoryProducts(category.products)
      setActiveCategory(category._id)
    }
  }, [categories, slug])

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(categoryProducts.length / PRODUCTS_PER_PAGE)

  const handleCategoryChange = (category) => {
    const categoryPath = category._id.toLowerCase().replace(/\s+/g, '-')
    setActiveCategory(category._id);
    if (categoryPath === slug) {
      router.push('/menu')
    } else {
      router.push(`/menu/category/${categoryPath}`)
    }
  }

  return (
    <div className="w-full flex">
      <div className="w-[75%] flex flex-col gap-5 ml-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-[#A0522D] text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="w-[25%] px-4">
        <div className="category-section">
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="text-xl font-bold">Category</span>
            <span className={`text-2xl flex items-center transform transition-transform duration-300 ${
              isCategoryOpen ? "rotate-180" : "rotate-0"
            }`}>
              <IoIosArrowUp />
            </span>
          </div>
          <ul className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isCategoryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } space-y-3`}>
            {isCategoryOpen && categories.map((category, index) => (
              <li
                key={index}
                className={`cursor-pointer px-3 py-2 shadow rounded-md transition ${activeCategory === category._id ? "bg-[#8B4513] text-white hover:bg-[#A0522D]" : "bg-white hover:bg-gray-200"}`}
                onClick={() => handleCategoryChange(category)}
              >
                <p>{category._id}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
"use client"
import { useState, useEffect } from 'react';
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-[#ae4f2f] hover:bg-[#8B4513] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}
      aria-label="Scroll to top"
    >
      <FaArrowUp className="text-xl animate-bounce" />
    </button>
  )
}

export default ScrollToTop
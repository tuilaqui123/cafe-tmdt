"use client"
import React, { useState, createContext, useEffect } from "react";
import axios from 'axios'

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState({})

    // get all products
    const fetchProduct = () => {
        axios.get('http://localhost:8081/v1/api/user/products')
            .then((res) => {
                setProducts(res.data)
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            })
    }

    // get product by id
    const getProductById = (id) => {
        axios.get(`http://localhost:8081/v1/api/user/products/${id}`)
            .then((res) => {
                setProduct(res.data)
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            })
    }

    // get category
    const getCategoríes = () => {
        axios.get(`http://localhost:8081/v1/api/user/products/categories`)
           .then((res) => {

                setCategories(res.data)
            })
           .catch((error) => {
                console.error('Error fetching category:', error);
            })
    }

    useEffect(() => {
        fetchProduct()
        getCategoríes()
    }, [])

    return <AppContext.Provider value={{
        products, setProducts, fetchProduct,
        product, setProduct, getProductById,
        categories, setCategories, getCategoríes
    }}>
        {children}
    </AppContext.Provider>
}
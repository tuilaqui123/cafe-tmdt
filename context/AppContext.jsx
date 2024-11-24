"use client"
import React, { useState, createContext, useEffect } from "react";
import axios from 'axios'

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState({})
    const [user, setUser] = useState()
    const [errorSignup, setErrorSignup] = useState(null)

    // sign up
    const signup = async (name, email, address, phone, password) => {
        setErrorSignup(null)
        const res = await axios.post('http://localhost:8081/v1/api/signup', {
            name: name,
            email: email,
            address: address,
            phone: phone,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res.data.success) {
            setUser(res.data)
        }
        return res.data
    }

    // sign in
    const signin = async (email, password) => {
        const res = await axios.post('http://localhost:8081/v1/api/login', {
            email: email,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (res.data.success) {
            setUser(res.data)
        }
        return res.data
    }

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
        categories, setCategories, getCategoríes,
        user, signup, errorSignup, setErrorSignup, signin
    }}>
        {children}
    </AppContext.Provider>
}
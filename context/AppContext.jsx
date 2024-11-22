"use client"
import React, { useState, createContext, useEffect } from "react";
import axios from 'axios'

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState({})
    const [user, setUser] = useState()
    const [cart, setCart] = useState([])
    const [totalCart, setTotalCart] = useState(null)
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

    // get cart by userId
    const getCartByUserId = () => {
        if (localStorage.user) {
            const userObj = JSON.parse(localStorage.user)
            const userId = userObj._id;

            axios.get(`http://localhost:8081/v1/api/user/carts/getCartByUserId/${userId}`)
               .then((res) => {
                    setCart(res.data.items)
                    setTotalCart(res.data.total)
                })
               .catch((error) => {
                    console.error('Error fetching cart:', error);
                })
        }
    }

    // add item to cart
    const addItemToCart = async (productId, size, quantity) => {
        if (localStorage.user) {
            const userObj = JSON.parse(localStorage.user)
            const userId = userObj._id;

            const res = await axios.post('http://localhost:8081/v1/api/user/carts/addItemCart', {
                userId: userId,
                productId: productId,
                size: size,
                quantity: quantity
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(res.data)
            // return res.data
            // if (res.data.success) {
            //     setUser(res.data)
            // }
            // return res.data
        }
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
        getCartByUserId()
    }, [])

    return <AppContext.Provider value={{
        products, setProducts, fetchProduct,
        product, setProduct, getProductById,
        categories, setCategories, getCategoríes,
        user, signup, errorSignup, setErrorSignup, signin,
        cart, setCart, getCartByUserId, totalCart,
        addItemToCart
    }}>
        {children}
    </AppContext.Provider>
}
"use client"
import React, { useState, createContext, useEffect } from "react";
import axios from 'axios'

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState({})
    const [user, setUser] = useState()
    const [cart, setCart] = useState({})
    const [cartId, setCartId] = useState(null)
    const [totalCart, setTotalCart] = useState(null)
    const [cartNoLog, setCartNoLog] = useState([])
    const [totalCartNoLog, setTotalCartNoLog] = useState(null)
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
                    setCart(res.data)
                    setTotalCart(res.data.total)
                })
               .catch((error) => {
                    console.error('Error fetching cart:', error);
                })
        }
    }

    // get cart by id
    const getCartById = (id) => {
        axios.get(`http://localhost:8081/v1/api/user/carts/getCartById/${id}`)
            .then((res) => {
                setCartNoLog(res.data)
                setTotalCartNoLog(res.data.total)
            })
            .catch((error) => {
                console.error('Error fetching cart:', error);
            })
    }

    // add new cart
    const addNewCart = async () => {
        const res = await axios.post('http://localhost:8081/v1/api/user/carts/addCart')
        return res.data
    }

    // add item to cart (no login)
    const addItemToCartNoLog = async (cartId, productId, size, quantity) => {
        const res = await axios.post('http://localhost:8081/v1/api/user/carts/addItemCartNoLogin', {
            cartId: cartId,
            productId: productId,
            size: size,
            quantity: quantity
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    }

    // add item to cart
    const addItemToCart = async (productId, size, quantity) => {
        if (localStorage.user) {
            const userObj = JSON.parse(localStorage.user)
            const userId = userObj._id

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
            return res.data
        }
    }

    // delete item out of cart
    const deleteItemFromCart = async (productId, size) => {
        if (localStorage.user) {
            const userObj = JSON.parse(localStorage.user)
            const userId = userObj._id

            const res = await axios.delete('http://localhost:8081/v1/api/user/carts/deleteItemCart', {
                data: {
                    userId: userId,
                    productId: productId,
                    size: size
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return res.data
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

        if (localStorage.user) {
            getCartByUserId()
        } else {
            getCartById(localStorage?.cartId)
        }
    }, [])

    return <AppContext.Provider value={{
        products, setProducts, fetchProduct,
        product, setProduct, getProductById,
        categories, setCategories, getCategoríes,
        user, signup, errorSignup, setErrorSignup, signin,
        cart, setCart, getCartByUserId, totalCart,
        addItemToCart, deleteItemFromCart, addItemToCartNoLog,
        cartNoLog, setCartNoLog, getCartById, totalCartNoLog, addNewCart,
    }}>
        {children}
    </AppContext.Provider>
}
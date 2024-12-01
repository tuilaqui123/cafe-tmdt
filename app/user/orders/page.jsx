"use client"
import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import ScrollToTop from '@/components/scrollToTop'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'doing': 'bg-blue-100 text-blue-800',
    'shipping': 'bg-purple-100 text-purple-800',
    'systemCancel': 'bg-red-100 text-red-800',
    'success': 'bg-green-100 text-green-800',
    'fail': 'bg-red-100 text-red-800',
    'customerCancel': 'bg-red-100 text-red-800',
    'confirmed': 'bg-cyan-100 text-cyan-800',
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE').format(number)
  }

  useEffect(() => {
    const fetchOrders = () => {
      fetch(`http://localhost:8081/v1/api/user/orders/users/${JSON.parse(localStorage.user)._id}`)
        .then(res => res.json())
        .then(data => { setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())) })
        .finally(() => { setLoading(false) })
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    if (!loading) {
      setFilteredOrders(
        orders.filter(order => {
          // const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
          // const matchesSearch = order.items.some(item => {
          //   item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
          // })

          const matchesSearch = order.items.some(item => {
            const isMatch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return isMatch;
          })

          console.log(matchesSearch)

          const matchesStatus = filterStatus === 'all' || order.deliveryStatus === filterStatus

          return matchesStatus && matchesSearch
        })
      )
    }

    // setFilteredOrders([...orders])
  }, [filterStatus, loading, searchTerm])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#A0522D]"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-8 mt-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#A0522D]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-[#A0522D]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="doing">Proccessing</option>
          <option value="shipping">Shipping</option>
          <option value="cancelled">Cancelled</option>
          <option value="success">Success</option>
          <option value="fail">Fail</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order {order._id}</h3>
                  <p className="text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.deliveryStatus]}`}>
                    {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatNumber(item.price)} đ</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-[#A0522D]">
                    {formatNumber(order.total)} đ
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-4">
                <Link
                  href={`/user/orders/${order._id}`}
                  className="px-4 py-2 bg-[#A0522D] text-white rounded-lg hover:bg-[#8B4513] transition-colors"
                >
                  View Details
                </Link>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ScrollToTop />
    </div>
  )
}

export default OrderManagement

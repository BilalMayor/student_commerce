export interface User {
  id: string
  name: string
  email: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  avatarUrl?: string
  isVerified?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  iconUrl?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  categoryId: string
  category?: Category
  sellerId: string
  sellerName?: string
  rating?: number
  reviewCount?: number
  productType?: 'DIGITAL' | 'PHYSICAL'
  fileUrl?: string
  fileSize?: number
  weight?: number
}

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentMethod = 'TRANSFER'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED'

export interface Order {
  id: string
  status: OrderStatus
  totalPrice: number
  shippingCost?: number
  paymentMethod: PaymentMethod
  addressId: string
  address?: Address
  payment?: Payment
  createdAt: string
  items?: OrderItem[]
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Payment {
  id: string
  orderId: string
  status: PaymentStatus
  amount: number
}

export interface Review {
  id: string
  productId: string
  rating: number
  comment: string
  userId: string
  user?: User
  product?: Product
  createdAt: string
}

export interface Address {
  id: string
  label: string
  recipientName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

export interface Notification {
  id: string
  title?: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface ApiError {
  message: string
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

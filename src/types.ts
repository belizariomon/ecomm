export type Category = 'Home' | 'Office' | 'Travel' | 'Wellness'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category
  stock: number
  image: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

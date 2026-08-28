import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../features/cart/CartProvider'
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <article className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt="" />
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
      </Link>
      <p>{product.description}</p>
      <div className="card-footer">
        <strong>${product.price.toFixed(2)}</strong>
        <button onClick={() => add(product)} disabled={!product.stock}>
          Add to cart
        </button>
      </div>
    </article>
  )
}

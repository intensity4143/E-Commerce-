import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {

    const {currency, delivery_fee, getCartAmount, products, buyNowItem} = useContext(ShopContext)

    const subtotal = buyNowItem
        ? (products.find((p) => p._id === buyNowItem.itemId)?.price || 0)
        : getCartAmount();

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'} />
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {subtotal}.00</p>
            </div>

            <hr className='text-gray-400'/>
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee}.00</p>
            </div>

            <hr className='text-gray-400'/>
            <div className='flex justify-between'>
                <p>Total Price</p>
                <p>{currency} {subtotal === 0 ? 0 : subtotal + delivery_fee}.00</p>
            </div>

        </div>
      
    </div>
  )
}

export default CartTotal

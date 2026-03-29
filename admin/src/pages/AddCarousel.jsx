import { useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddCarousel = ({ token }) => {
  const [image, setImage] = useState(false)
  const [eyebrow, setEyebrow] = useState('')
  const [heading, setHeading] = useState('')
  const [subheading, setSubheading] = useState('')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#414141')
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [order, setOrder] = useState(0)
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!image) return toast.error('Please upload an image')

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('image', image)
      formData.append('eyebrow', eyebrow)
      formData.append('heading', heading)
      formData.append('subheading', subheading)
      formData.append('bgColor', bgColor)
      formData.append('textColor', textColor)
      formData.append('ctaLabel', ctaLabel)
      formData.append('ctaUrl', ctaUrl)
      formData.append('order', order)
      formData.append('active', active)

      const response = await axios.post(
        `${backendUrl}/api/slides/hero-slides`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.slide) {
        toast.success('Slide added successfully')
        setImage(false)
        setEyebrow('')
        setHeading('')
        setSubheading('')
        setBgColor('#ffffff')
        setTextColor('#414141')
        setCtaLabel('')
        setCtaUrl('')
        setOrder(0)
        setActive(true)
      }
       else {
        toast.error('Failed to add slide')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <p className='text-lg font-medium'>Add Carousel Slide</p>

      {/* Image Upload */}
      <div>
        <p className='mb-2'>Slide Image</p>
        <label htmlFor='carouselImage'>
          <img
            className='w-40 h-24 object-cover cursor-pointer border border-gray-200'
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=''
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type='file'
            id='carouselImage'
            hidden
          />
        </label>
      </div>

      {/* Eyebrow */}
      <div className='w-full'>
        <p className='mb-2'>Eyebrow Text <span className='text-gray-400 text-xs'>(e.g. OUR BESTSELLERS)</span></p>
        <input
          value={eyebrow}
          onChange={(e) => setEyebrow(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2 border border-gray-300'
          type='text'
          placeholder='OUR BESTSELLERS'
        />
      </div>

      {/* Heading */}
      <div className='w-full'>
        <p className='mb-2'>Heading</p>
        <input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2 border border-gray-300'
          type='text'
          placeholder='Latest Arrivals'
        />
      </div>

      {/* Subheading */}
      <div className='w-full'>
        <p className='mb-2'>Subheading</p>
        <input
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2 border border-gray-300'
          type='text'
          placeholder='Fresh styles, just dropped.'
        />
      </div>

      {/* Colors */}
      <div className='flex gap-8'>
        <div>
          <p className='mb-2'>Background Color</p>
          <div className='flex items-center gap-2'>
            <input
              type='color'
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className='w-10 h-10 cursor-pointer border-none'
            />
            <span className='text-sm text-gray-500'>{bgColor}</span>
          </div>
        </div>
        <div>
          <p className='mb-2'>Text Color</p>
          <div className='flex items-center gap-2'>
            <input
              type='color'
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className='w-10 h-10 cursor-pointer border-none'
            />
            <span className='text-sm text-gray-500'>{textColor}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2'>CTA Button Label</p>
          <input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300'
            type='text'
            placeholder='Shop Now'
          />
        </div>
        <div>
          <p className='mb-2'>CTA URL</p>
          <input
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300'
            type='text'
            placeholder='/collection'
          />
        </div>
        <div>
          <p className='mb-2'>Display Order</p>
          <input
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 sm:w-[80px]'
            type='number'
            min='0'
          />
        </div>
      </div>

      {/* Active toggle */}
      <div className='flex gap-2 mt-2'>
        <input
          checked={active}
          onChange={() => setActive((prev) => !prev)}
          type='checkbox'
          id='activeSlide'
        />
        <label className='cursor-pointer' htmlFor='activeSlide'>Show on website</label>
      </div>

      <button
        disabled={loading}
        className='w-36 py-3 mt-4 bg-black text-white'
        type='submit'
      >
        {loading ? 'ADDING...' : 'ADD SLIDE'}
      </button>
    </form>
  )
}

export default AddCarousel
import { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'

const ListCarousel = ({ token }) => {
  const [slides, setSlides] = useState([])

  const fetchSlides = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/slides/hero-slides`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.slides) {
        setSlides(response.data.slides)
      } else {
        toast.error('Failed to fetch slides')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeSlide = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/admin/hero-slides/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.message) {
        toast.success('Slide deleted')
        setSlides((prev) => prev.filter((s) => s._id !== id))
      } else {
        toast.error('Failed to delete slide')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  return (
    <>
      <p className='mb-2'>All Carousel Slides</p>
      <div className='flex flex-col gap-2'>

        {/* Header */}
        <div className='hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] items-center py-2 px-2 bg-gray-100 text-sm border border-gray-200'>
          <b>Image</b>
          <b>Heading</b>
          <b>Subheading</b>
          <b>Order</b>
          <b>Status</b>
          <b className='text-center'>Action</b>
        </div>

        {slides.length === 0 && (
          <p className='text-sm text-gray-400 mt-4'>No slides found. Add one from Add Carousel page.</p>
        )}

        {slides.map((slide) => (
          <div
            key={slide._id}
            className='grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 border border-gray-200 text-sm'
          >
            <img
              className='w-16 h-10 object-cover'
              src={slide.image}
              alt={slide.heading || 'slide'}
            />
            <p>{slide.heading || <span className='text-gray-400'>—</span>}</p>
            <p className='hidden md:block'>{slide.subheading || <span className='text-gray-400'>—</span>}</p>
            <p className='hidden md:block'>{slide.order}</p>
            <p className='hidden md:block'>
              <span className={`px-2 py-0.5 text-xs ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {slide.active ? 'Active' : 'Hidden'}
              </span>
            </p>
            <div className='justify-self-center'>
              <Trash2
                onClick={() => removeSlide(slide._id)}
                className='hover:text-red-700 cursor-pointer'
                size={18}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ListCarousel
import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div className='animate-in fade-in duration-700'>
      
      {/* Header Section */}
      <div className='text-2xl text-center pt-10 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* Hero Content Section */}
      <div className='my-12 flex flex-col md:flex-row gap-16 items-center'>
        <div className='w-full md:max-w-[450px] overflow-hidden rounded-sm shadow-sm'>
             <img 
                className='w-full hover:scale-105 transition-transform duration-500' 
                src={assets.about_img} 
                alt="About our brand" 
            />
        </div>
        
        <div className='flex flex-col justify-center gap-8 md:w-2/4 text-gray-600 leading-relaxed'>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum ea placeat porro vel, aliquam aperiam? Blanditiis voluptatibus, debitis officiis cupiditate repellendus, veritatis modi quos adipisci asperiores, id quas fugit soluta!
            Soluta corporis veniam sapiente quia? Quasi dicta odit, autem provident expedita aut, quo dolore ad tempore animi voluptate.
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate ut modi vitae aspernatur dolores omnis veritatis, repellat cum quae tempore reiciendis iste accusantium animi temporibus laudantium! Adipisci reiciendis ullam.
          </p>

          <div className='border-l-4 border-gray-800 pl-4'>
            <b className='text-gray-800 text-lg block mb-2'>Our Mission</b>
            <p>Our mission is to empower customers with choice, convenience, and confidence. We are dedicated to providing a seamless shopping experience that exceeds expectations, from browsing to delivery.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-2xl py-8'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-24'>
        {/* Quality Card */}
        <div className='border border-gray-100 px-10 md:px-16 py-12 sm:py-20 flex flex-col gap-5 hover:bg-gray-800 hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white uppercase tracking-widest'>Quality Assurance:</b>
          <p className='text-gray-600 group-hover:text-gray-300'>We meticulously select and vet each product to ensure it meets our stringent quality standards. Your satisfaction is our top priority.</p>
        </div>

        {/* Convenience Card */}
        <div className='border border-gray-100 px-10 md:px-16 py-12 sm:py-20 flex flex-col gap-5 hover:bg-gray-800 hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white uppercase tracking-widest'>Convenience:</b>
          <p className='text-gray-600 group-hover:text-gray-300'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier or more efficient.</p>
        </div>

        {/* Service Card */}
        <div className='border border-gray-100 px-10 md:px-16 py-12 sm:py-20 flex flex-col gap-5 hover:bg-gray-800 hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white uppercase tracking-widest'>Exceptional Customer Service:</b>
          <p className='text-gray-600 group-hover:text-gray-300'>Our team of dedicated professionals is here to assist you the way, ensuring your inquiries are addressed with care.</p>
        </div>
      </div>

      <NewsLetterBox/>
      
    </div>
  )
}

export default About
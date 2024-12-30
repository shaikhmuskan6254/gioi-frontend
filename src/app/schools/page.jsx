import AuthForm from '@/components/Register/adminregistration/AuthForm'
import Footer from '@/components/layouts/footer/footer'
import Navbar from '@/components/layouts/navbar/navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <AuthForm/>
        <Footer/>
    </div>
  )
}

export default page
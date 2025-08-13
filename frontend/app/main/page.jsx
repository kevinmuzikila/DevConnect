import React from 'react'
import Header from '../../(components)/Header'
import Footer from '../../(components)/Footer'
import MainContent from './(components)/MainContent'

function page() {
  return (
    <div>
        <Header/>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 text-center text-sm">
        We've added 120 new developer jobs today! 🚀
      </div>
  <MainContent/>
        <Footer/>
    </div>
  )
}

export default page
import React from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';

function DashboardLayout({children}) {
  return (
    <div>
      <Header />
      <div>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default DashboardLayout
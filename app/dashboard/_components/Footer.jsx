"use client"
import React from 'react'
import Link from 'next/link'
import { Leaf, Mail, MapPin, Phone, Github, Linkedin, Twitter, Heart } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Dashboard", href: "/dashboard" }
    ],

    support: [
      { label: "FAQs", href: "/dashboard/questions" },
  
    ],
  };

  const socialLinks = [
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#1a4d4d] to-[#0d2626] text-white overflow-hidden">
      {/* Decorative blur elements */}
      <div className='absolute top-10 right-20 w-96 h-96 bg-[#4a6b5b] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float pointer-events-none' />
      <div className='absolute bottom-10 left-20 w-96 h-96 bg-[#2d5f5f] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none' style={{animationDelay: '2s'}} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className='flex items-center space-x-3 mb-6 group'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#2d5f5f] to-[#4a6b5b] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center shadow-soft hover:shadow-md transition-shadow'>
                <img src="/logo.svg" alt="logo" />
              </div>
              <span className='text-2xl font-display font-bold text-white'>
                IntervAi
              </span>
            </Link>
            <p className="text-[#c5d5d0] leading-relaxed mb-6 font-light max-w-sm">
              Cultivate your interview skills with thoughtfully designed AI-powered practice sessions. Grow your confidence naturally.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                >
                  <Icon className="w-4 h-4 text-[#c5d5d0]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-medium text-white mb-5 font-display">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-[#c5d5d0] hover:text-white transition-colors duration-200 font-light hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-medium text-white mb-5 font-display">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-[#c5d5d0] hover:text-white transition-colors duration-200 font-light hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#c5d5d0] text-sm font-light flex items-center">
              © {currentYear} IntervAi. Crafted with
              <Heart className="w-4 h-4 mx-1 text-[#f4cdb8] fill-current" />
              for your growth
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

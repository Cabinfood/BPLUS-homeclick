import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="bg-white w-full">
      {/* Top service features section */}
      <div className="bg-gray-50 py-8">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Free Shipping */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Free Shipping over USD $35</p>
                <p className="text-xs text-gray-500">Free Fast-Delivery Upgrade</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0119.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">We accept credit cards, PayPal, Apple Pay, Affirm, and</p>
                <p className="text-xs text-gray-500">bank wires</p>
              </div>
            </div>

            {/* Customer Service */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Order Service: <span className="text-blue-600">Live Chat</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="content-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Product Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Product Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Camera Drones</a></li>
              <li><a href="#" className="hover:text-gray-900">Handheld</a></li>
              <li><a href="#" className="hover:text-gray-900">Education & Industry</a></li>
              <li><a href="#" className="hover:text-gray-900">Service</a></li>
              <li><a href="#" className="hover:text-gray-900">Accessory</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Help & Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Payment Methods</a></li>
              <li><a href="#" className="hover:text-gray-900">Order Information</a></li>
              <li><a href="#" className="hover:text-gray-900">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-gray-900">Return Policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Technical Support</a></li>
              <li><a href="#" className="hover:text-gray-900">Repair Services</a></li>
              <li><a href="#" className="hover:text-gray-900">After-Sales Service Policies</a></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Programs</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">DJI Credit</a></li>
              <li><a href="#" className="hover:text-gray-900">Official Refurbished</a></li>
              <li><a href="#" className="hover:text-gray-900">DJI Store App</a></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">SkyPixel</a></li>
              <li><a href="#" className="hover:text-gray-900">DJI Forum</a></li>
              <li><a href="#" className="hover:text-gray-900">Buying Guides</a></li>
              <li><a href="#" className="hover:text-gray-900">Fly Safe</a></li>
              <li><a href="#" className="hover:text-gray-900">DJI Flying Tips</a></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Subscribe</h3>
            <p className="text-sm text-gray-600">Get the latest news about our newest offerings and hottest deals, and what's new.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
              <button className="px-4 py-2 bg-gray-800 text-white text-sm rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Left side - Company info and links */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
              <div className="flex items-center gap-2">
                <LocalizedClientLink href="/" className="text-xl font-bold text-gray-900">
                  dji
                </LocalizedClientLink>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-700">Who We Are</a>
                <a href="#" className="hover:text-gray-700">Contact Us</a>
                <a href="#" className="hover:text-gray-700">Careers</a>
                <a href="#" className="hover:text-gray-700">Flagship Stores</a>
              </div>
            </div>

            {/* Right side - Social media icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.117.112.22.083.339-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.749-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91-.11-.937-.227-2.482.025-3.566.217-.932 1.405-5.956 1.405-5.956s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.343l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.63-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.5 24.009c6.624 0 11.99-5.367 11.99-12C24.49 5.367 19.123.001 12.5.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright and legal info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs text-gray-500">
              <div className="flex flex-wrap items-center gap-4">
                <span>Copyright © 2025 DJI All Rights Reserved.</span>
                <a href="#" className="hover:text-gray-700">Privacy Policy</a>
                <a href="#" className="hover:text-gray-700">Cookie Preferences</a>
                <a href="#" className="hover:text-gray-700">Do Not Sell Or Share My Personal Information</a>
                <a href="#" className="hover:text-gray-700">Terms of Use</a>
                <a href="#" className="hover:text-gray-700">Site Map</a>
              </div>
              <div>
                <a href="#" className="hover:text-gray-700">Feedback on web experience? Click here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

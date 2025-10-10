import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-white w-full">
      {/* Top service features section */}
      <div className="bg-gray-50 py-8">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Free Shipping */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center">
                <Image 
                  src="/delivery-icon.svg" 
                  alt="Giao hàng" 
                  width={40} 
                  height={40}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Giao nhanh</p>
                <p className="text-xs text-gray-500">Luôn có mã Freeship cho mỗi đơn hàng</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center">
                <Image 
                  src="/payment-icon.svg" 
                  alt="Thanh toán" 
                  width={40} 
                  height={40}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Thanh toán linh hoạt</p>
                <p className="text-xs text-gray-500">Thoải mái thanh toán online hoặc trả góp</p>
              </div>
            </div>

            {/* Customer Service */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center">
                <Image 
                  src="/chat-icon.svg" 
                  alt="Live Chat" 
                  width={40} 
                  height={40}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Liên hệ tư vấn và hỗ trợ: <span className="text-blue-600">Live Chat</span></p>
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
            <h3 className="text-sm font-medium text-gray-900">Danh mục sản phẩm</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Nội thất</a></li>
              <li><a href="#" className="hover:text-gray-900">Ngoại thất</a></li>
              <li><a href="#" className="hover:text-gray-900">Đồ bếp</a></li>
              <li><a href="#" className="hover:text-gray-900">Đồ gia dụng</a></li>
              <li><a href="#" className="hover:text-gray-900">Đồ decor</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Chính sách thanh toán</a></li>
              <li><a href="#" className="hover:text-gray-900">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-gray-900">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-gray-900">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-gray-900">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-gray-900">Chính sách giá</a></li>
              <li><a href="#" className="hover:text-gray-900">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-gray-900">Xử lý hoàn hàng</a></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Cộng đồng Chạm Nhà</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Tài khoản hội viên</a></li>
              <li><a href="#" className="hover:text-gray-900">Đăng ký hội viên</a></li>
              <li><a href="#" className="hover:text-gray-900">Ưu đãi & Đặc quyền</a></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">Khám phá</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Trải nghiệm khách hàng</a></li>
              <li><a href="#" className="hover:text-gray-900">Tin tức</a></li>
              <li><a href="#" className="hover:text-gray-900">Bí quyết</a></li>
              <li><a href="#" className="hover:text-gray-900">Hướng dẫn</a></li>
              <li><a href="#" className="hover:text-gray-900">Liên hệ</a></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-900">HomeClick luôn lắng nghe bạn!</h3>
            <p className="text-sm text-gray-600">Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.</p>
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
                <Image src="/icon.svg" alt="Logo" width={50} height={50} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-700">Về HomeClick</a>
                <a href="#" className="hover:text-gray-700">Chăm sóc khách hàng</a>
                <a href="#" className="hover:text-gray-700">Tuyển dụng</a>
                <a href="#" className="hover:text-gray-700">Cửa hàng Flagship</a>
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
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright and legal info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs text-gray-500">
              <div className="flex flex-wrap items-center gap-4">
                <span>Copyright © {new Date().getFullYear()} HomeClick All Rights Reserved.</span>
                <span className="text-gray-400 text-xs cursor-pointer">CÔNG TY TNHH GIA MỘC- GPKD số 0313697597 do Sở KH và ĐT TP HCM cấp ngày 15/03/2016 - Địa chỉ: 68 Nguyễn Huệ, Phường Sài Gòn, TP. Hồ Chí Minh</span>
              </div>
              <div>
                <a href="#" className="hover:text-gray-700">Make by <span className="text-blue-600">HomeClick</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

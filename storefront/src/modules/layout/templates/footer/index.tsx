import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 w-full">
      <div className="content-container">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Logo and social icons section */}
          <div className="flex flex-col gap-4">
            <LocalizedClientLink href="/" className="text-2xl font-bold text-blue-600">
              pro
            </LocalizedClientLink>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-black rounded flex items-center justify-center text-white hover:bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white hover:bg-red-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-black rounded flex items-center justify-center text-white hover:bg-gray-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.117.112.22.083.339-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.749-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white hover:bg-blue-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Hotline và Cửa hàng */}
          <div className="flex flex-col gap-6">
              {/* Hotline */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800">Hotline</h3>
                <div className="flex items-center gap-2 text-blue-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span className="font-semibold">0988089534</span>
                </div>
              </div>

              {/* Cửa hàng Hà Nội */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800">Cửa hàng Hà Nội</h3>
                <div className="text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>53 Thái Hà, Trung Liệt, Đống Đa <br/><span className="text-blue-600">(Chỉ đường)</span></span>
                  </div>
                </div>
              </div>

              {/* Cửa hàng TP. HCM */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800">Cửa hàng TP. HCM</h3>
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>5 - 7 Nguyễn Huy Tưởng, P.6, Q.Bình Thạnh <br/><span className="text-blue-600">(Chỉ đường)</span></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>95 Trần Thiện Chánh, P.12, Q.10 <br/><span className="text-blue-600">(Chỉ đường)</span></span>
                  </div>
                </div>
              </div>
          </div>

          {/* Thông tin hữu ích */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-800">Thông tin hữu ích</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách thanh toán</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách kiểm hàng</a></li>
              <li><a href="#" className="hover:text-blue-600">Hướng dẫn mua hàng online</a></li>
              <li><a href="#" className="hover:text-blue-600">Về chúng tôi</a></li>
            </ul>
          </div>

          {/* Phản hồi, góp ý */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-800">Phản hồi, góp ý</h3>
            <div className="text-sm text-gray-600">
              <p>Đội ngũ Kiểm Soát Chất Lượng của chúng tôi sẵn sàng lắng nghe quy khách.</p>
              <button className="mt-3 bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-200 py-6">
          <div className="text-xs text-gray-500 space-y-1">
            <p>© {new Date().getFullYear()} Furniture Maker. All rights reserved.</p>
            <p>CGPKD số 0313697597 do Sở KH và ĐT TP HCM cấp ngày 15/03/2016</p>
            <p>Địa chỉ: 68 Nguyễn Huệ, Phường Sài Gòn, TP. Hồ Chí Minh;Hotline: 0988089534
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

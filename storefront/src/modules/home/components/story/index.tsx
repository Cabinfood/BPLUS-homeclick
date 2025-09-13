import { Heading } from "@medusajs/ui"

const Story = () => {
  return (
    <section className="w-full py-16 px-4">
      <div className="content-container mx-auto">
        <div className="max-w-4xl">
          {/* Section Label */}
          <p className="text-sm font-medium text-gray-600 mb-8 uppercase tracking-wide">
          CÂU CHUYỆN THƯƠNG HIỆU
          </p>
          
          {/* Main Content */}
          <div className="space-y-8">
            <Heading
              level="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black"
            >
              Một Chạm Về Nhà
            </Heading>
            
            <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-800">
              <p>
              Có một nơi chốn không đo bằng mét vuông, mà đong đầy bằng yêu thương - đó là <strong>Nhà</strong>. Và có một khoảnh khắc kỳ diệu, khi chỉ bằng một cú <strong>Click</strong>, cánh cửa dẫn lối về chốn bình yên ấy chợt rộng mở.
              </p>
              
              <p>
              <strong>HomeClick</strong> ra đời để biến khoảnh khắc đó thành hiện thực. Chúng tôi phá bỏ mọi rào cản, mang đến một thế giới nội thất "tất cả trong một", nơi mọi thứ bạn cần cho tổ ấm, từ chiếc sofa lớn đến món đồ trang trí nhỏ nhất, đều đang chờ đợi trong tầm tay. Tất cả để thực hiện một sứ mệnh duy nhất:<strong>"Mang tổ ấm đến gần bạn hơn, chỉ bằng một cú nhấp chuột"</strong> 
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Story

import { Heading } from "@medusajs/ui"
import { ChevronRight } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Sofa",
      handle: "sofa",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Chairs",
      handle: "chairs",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Coffee & Side Tables",
      handle: "coffee-side-tables",
      image: "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      name: "Lighting",
      handle: "lighting",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 5,
      name: "Decorations",
      handle: "decorations",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ]

  return (
    <section className="w-full py-12 px-4">
      <div className="content-container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading
              level="h2"
              className="text-2xl md:text-3xl font-bold text-black mb-2"
            >
              Cửa Hàng.
            </Heading>
            <p className="text-lg text-gray-600">
              Cách tốt nhất để mua sản phẩm bạn thích.
            </p>
          </div>
          
          {/* Help Section */}
          <div className="hidden md:flex items-center text-sm text-gray-600">
            <span>Bạn cần trợ giúp mua sắm?</span>
            <LocalizedClientLink 
              href="/contact" 
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Hỏi Chuyên Gia →
            </LocalizedClientLink>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="flex-shrink-0 group"
              >
                <div className="w-32 md:w-40 text-center">
                  {/* Category Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <p className="text-sm md:text-base font-medium text-gray-800 group-hover:text-black transition-colors">
                    {category.name}
                  </p>
                </div>
              </LocalizedClientLink>
            ))}
            
            {/* Show More Button */}
            <div className="flex-shrink-0 group">
              <div className="w-32 md:w-40 text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                  <ChevronRight className="text-gray-600" />
                </div>
                <p className="text-sm md:text-base font-medium text-gray-600">
                  Xem thêm
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Categories

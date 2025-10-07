import React from "react"
import { useEffect } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Text } from "@medusajs/ui"

// Custom login widget để customize trang login
const LoginCustomizationWidget = () => {
  useEffect(() => {
    // Thay đổi AvatarBox component (logo MedusaJS) và text
    const customizeLoginPage = () => {
      // Thay đổi hình ảnh trong AvatarBox component
      const avatarBoxElements = document.querySelectorAll('[class*="avatar"], [class*="Avatar"]')
      avatarBoxElements.forEach((element) => {
        // Tìm img hoặc svg trong AvatarBox
        const imgElement = element.querySelector('img') as HTMLImageElement
        const svgElement = element.querySelector('svg') as SVGElement
        
        if (imgElement) {
          imgElement.src = 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/493602769_1325070566293673_68252174675609987_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF7alYJOLndqySrz54Mb-kgeaOGSHtH1DF5o4ZIe0fUMe8TLjYcwaq6PaOfllOG17E&_nc_ohc=uZ0SeWn29IEQ7kNvwHzNN9z&_nc_oc=AdnPEcY39ASK-M1HlOiHBqgdA6b4d29F6i91O-kBUCmpbQ1X7K0dOZHWg8axCiLbI9c&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=80WsDvcaWfRyl9zsHwqGHw&oh=00_AfbxXOHWCuf3v6Zsy7DpSArZ2bidHdeVlQ1xFJ94F49pNw&oe=68CAC17D'
          imgElement.alt = 'HomeClick Logo'
        } else if (svgElement) {
          // Nếu là SVG, thay thế bằng img element
          const newImg = document.createElement('img')
          newImg.src = 'https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/493602769_1325070566293673_68252174675609987_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF7alYJOLndqySrz54Mb-kgeaOGSHtH1DF5o4ZIe0fUMe8TLjYcwaq6PaOfllOG17E&_nc_ohc=uZ0SeWn29IEQ7kNvwHzNN9z&_nc_oc=AdnPEcY39ASK-M1HlOiHBqgdA6b4d29F6i91O-kBUCmpbQ1X7K0dOZHWg8axCiLbI9c&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=80WsDvcaWfRyl9zsHwqGHw&oh=00_AfbxXOHWCuf3v6Zsy7DpSArZ2bidHdeVlQ1xFJ94F49pNw&oe=68CAC17D'
          newImg.alt = 'HomeClick Logo'
          newImg.style.width = svgElement.style.width || '64px'
          newImg.style.height = svgElement.style.height || '64px'
          newImg.style.borderRadius = '50%'
          svgElement.parentNode?.replaceChild(newImg, svgElement)
        }
      })
      
      // Backup: tìm theo structure và thay đổi hình ảnh
      const logoContainers = document.querySelectorAll('div > div:first-child')
      logoContainers.forEach((container) => {
        const rect = container.getBoundingClientRect()
        if (rect.height < 100 && rect.width < 200) {
          const imgElement = container.querySelector('img') as HTMLImageElement
          const svgElement = container.querySelector('svg') as SVGElement
          
          if (imgElement) {
            imgElement.src = 'https://pub-dbd0116f56fc4149a45bf9323e9e0ad0.r2.dev/brand-assets/icon.jpg'
            imgElement.alt = 'HomeClick Logo'
          } else if (svgElement) {
            const newImg = document.createElement('img')
            newImg.src = 'https://pub-dbd0116f56fc4149a45bf9323e9e0ad0.r2.dev/brand-assets/icon.jpg'
            newImg.alt = 'HomeClick Logo'
            newImg.style.width = '64px'
            newImg.style.borderRadius = '50%'
            svgElement.parentNode?.replaceChild(newImg, svgElement)
          }
        }
      })

      // Thay đổi text "Welcome to Medusa" thành "Welcome to HomeClick"
      const headingElements = document.querySelectorAll('h1, h2, h3, .heading, [class*="heading"]')
      headingElements.forEach((heading) => {
        if (heading.textContent?.includes('Welcome to Medusa')) {
          heading.textContent = heading.textContent.replace('Welcome to Medusa', 'Welcome to HomeClick')
        }
        if (heading.textContent?.includes('Medusa')) {
          heading.textContent = heading.textContent.replace('Medusa', 'HomeClick')
        }
      })

      // Tìm tất cả text nodes có chứa "Medusa"
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      )
      
      const textNodes: Text[] = []
      let node
      while (node = walker.nextNode()) {
        if (node.textContent?.includes('Medusa')) {
          textNodes.push(node as Text)
        }
      }
      
      textNodes.forEach((textNode) => {
        if (textNode.textContent) {
          textNode.textContent = textNode.textContent.replace(/Welcome to Medusa/g, 'Welcome to HomeClick')
          textNode.textContent = textNode.textContent.replace(/Medusa/g, 'HomeClick')
        }
      })
    }

    // Chạy ngay lập tức
    customizeLoginPage()
    
    // Chạy lại sau một khoảng thời gian ngắn để đảm bảo DOM đã render xong
    const timer = setTimeout(customizeLoginPage, 100)
    
    return () => clearTimeout(timer)
  }, [])
}

// Widget configuration
export const config = defineWidgetConfig({
  zone: "login.before",
})

export default LoginCustomizationWidget

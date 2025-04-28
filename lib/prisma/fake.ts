// // const user = await prisma.user.create({
// //     data: {
// //         name: 'quindart',
// //         email: 'quindart@example.com',
// //         password: 'quindart',
// //     },
// // });
// // console.log('Created user:', user);

// // Create categories
// // const webDevCategory = await prisma.category.create({
// //     data: {
// //         name: 'Web Development',
// //         slug: 'web-development',
// //     },
// // });

// // const systemDesignCategory = await prisma.category.create({
// //     data: {
// //         name: 'System Design',
// //         slug: 'system-design',
// //     },
// // });

// // const devToolsCategory = await prisma.category.create({
// //     data: {
// //         name: 'Development Tools',
// //         slug: 'dev-tools',
// //     },
// // });

// // console.log('Created categories');

// // Create SEO entries
// // const microservicesSeo = await prisma.sEO.create({
// //     data: {
// //         metaTitle: 'Từ Monolithic Đến Microservices | Quindart Blog',
// //         metaDescription: 'Tìm hiểu về kiến trúc microservices, những ưu điểm và thách thức khi chuyển từ monolithic sang microservices.',
// //         keywords: ['microservices', 'monolithic', 'system architecture', 'web development', 'backend'],
// //         canonicalUrl: '/blog/monolithic-to-microservices',
// //     },
// // });

// // const systemDesignSeo = await prisma.sEO.create({
// //     data: {
// //         metaTitle: 'System Design Interview | Quindart Blog',
// //         metaDescription: 'Hướng dẫn chuẩn bị cho System Design Interview với các big tech tại Việt Nam.',
// //         keywords: ['system design', 'interview', 'tech interview', 'big tech', 'software architecture'],
// //         canonicalUrl: '/blog/system-design-interview',
// //     },
// // });

// // const wslSeo = await prisma.sEO.create({
// //     data: {
// //         metaTitle: 'Installing Linux by WSL step by step | Quindart Blog',
// //         metaDescription: 'Hướng dẫn chi tiết cài đặt và sử dụng Windows Subsystem for Linux (WSL) cho môi trường phát triển.',
// //         keywords: ['WSL', 'Windows Subsystem for Linux', 'development environment', 'linux', 'windows'],
// //         canonicalUrl: '/blog/installing-linux-by-wsl',
// //     },
// // });

// // console.log('Created SEO entries');

// // Create blog posts

// const systemDesignPost = await prisma.post.create({
//     data: {
//         title: 'System Design Interview',
//         slug: 'system-design-interview',
//         content: `# System Design Interview

// System Design Interview là vòng phỏng vấn đánh giá khả năng thiết kế hệ thống phần mềm có quy mô lớn, được sử dụng bởi phần lớn các big tech ở thị trường Việt Nam.

// ## Các loại System Design Interview

// System Design Interviews có nhiều loại khác nhau, bao gồm:
// - OOP Design: Thiết kế các đối tượng và quan hệ
// - Front-end Design: Thiết kế giao diện và trải nghiệm người dùng
// - Product Design: Thiết kế sản phẩm từ góc độ người dùng
// - Infrastructure Design: Thiết kế hạ tầng và kiến trúc hệ thống

// ## Chuẩn bị cho System Design Interview

// ### 1. Hiểu rõ yêu cầu
// Trước khi bắt đầu thiết kế, cần làm rõ các yêu cầu của hệ thống, bao gồm:
// - Tính năng cần có
// - Quy mô dự kiến (số lượng người dùng, lưu lượng dữ liệu)
// - Yêu cầu về hiệu suất, độ tin cậy, bảo mật

// ### 2. Phác thảo kiến trúc tổng thể
// - Xác định các thành phần chính của hệ thống
// - Mô tả luồng dữ liệu và tương tác giữa các thành phần

// ### 3. Đi sâu vào từng thành phần
// - Thiết kế chi tiết cho từng thành phần
// - Xem xét các công nghệ phù hợp
// - Xác định cơ sở dữ liệu và cách tổ chức dữ liệu

// ### 4. Giải quyết các điểm nghẽn
// - Xác định các điểm nghẽn tiềm ẩn
// - Đề xuất giải pháp mở rộng quy mô
// - Thảo luận về các chiến lược cân bằng tải

// ## Kết luận

// System Design Interview đánh giá không chỉ kiến thức kỹ thuật mà còn khả năng tư duy hệ thống và giải quyết vấn đề của ứng viên. Chuẩn bị kỹ lưỡng và hiểu rõ nguyên tắc thiết kế là chìa khóa để thành công.`,
//         excerpt: 'System Design Interview là vòng phỏng vấn đánh giá khả năng thiết kế hệ thống phần mềm có quy mô lớn, được sử dụng bởi phần lớn các big tech ở thị trường Việt Nam.',
//         featuredImage: '/assets/blogs/system-design.webp',
//         status: 'published',
//         authorId: 1,
//         categoryId: 2,
//         id: 1,
//     },
// });

// const wslPost = await prisma.post.create({
//     data: {
//         title: 'Installing Linux by WSL step by step',
//         slug: 'installing-linux-by-wsl',
//         content: `# Installing Linux by WSL step by step

// Windows Subsystem for Linux (WSL) hữu ích khi bạn cần phát triển hoặc làm việc với các công cụ và môi trường phát triển Linux trên máy Windows mà không cần phải sử dụng máy ảo.

// ## Lợi ích của WSL

// Trong thực tế việc production project lên host thường được chạy ở môi trường Linux, trong khi giai đoạn development đa số sử dụng HĐH Window việc kiểm thử và testing trở nên khó khăn. Ngoài ra, bạn cũng rất khó chịu khi một lib nào đó có sẵn trên linux nhưng lại không hỗ trợ cho window. WSL ra đời nhằm tối giản việc phải cài đặt máy ảo phức tạp, mà bạn vẫn có thể thao tác với bash của linux thông qua CMD hay PowerShell.

// ## Các bước cài đặt WSL

// ### 1. Kích hoạt tính năng WSL
// Mở PowerShell với quyền Administrator và chạy lệnh:
// \`\`\`powershell
// dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
// \`\`\`

// ### 2. Kích hoạt Virtual Machine Platform
// \`\`\`powershell
// dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
// \`\`\`

// ### 3. Khởi động lại máy tính

// ### 4. Tải về và cài đặt Linux kernel update package
// Tải gói cập nhật kernel WSL2 từ Microsoft và cài đặt.

// ### 5. Đặt WSL2 làm phiên bản mặc định
// \`\`\`powershell
// wsl --set-default-version 2
// \`\`\`

// ### 6. Cài đặt bản phân phối Linux
// Mở Microsoft Store và tìm kiếm bản phân phối Linux mà bạn muốn cài đặt (Ubuntu, Debian, Kali Linux, ...).

// ### 7. Khởi động và cài đặt
// Sau khi cài đặt, khởi động bản phân phối Linux và thiết lập tên người dùng và mật khẩu.

// ## Sử dụng WSL

// Sau khi cài đặt, bạn có thể:
// - Mở Command Prompt hoặc PowerShell và nhập \`wsl\` để truy cập vào môi trường Linux
// - Sử dụng Visual Studio Code với extension "Remote - WSL" để phát triển trong môi trường Linux
// - Chạy các lệnh Linux và cài đặt các gói phần mềm thông qua package manager của bản phân phối đã cài đặt

// ## Kết luận

// WSL là một công cụ mạnh mẽ giúp kết hợp các ưu điểm của Windows và Linux, đặc biệt phù hợp cho các nhà phát triển làm việc trên nhiều nền tảng.`,
//         excerpt: 'Windows Subsystem for Linux (WSL) hữu ích khi bạn cần phát triển hoặc làm việc với các công cụ và môi trường phát triển Linux trên máy Windows mà không cần phải sử dụng máy ảo.',
//         featuredImage: '/assets/blogs/wsl_card.webp',
//         status: 'published',
//         authorId: 1,
//         categoryId: 3,
//         id: 3,
//     },
// });

// console.log('Created blog posts');

// // Create a demo project
// const projectSeo = await prisma.
//     sEO.create({
//         data: {
//             metaTitle: 'QBlog - Personal Blog and Portfolio Platform | Quindart Projects',
//             metaDescription: 'QBlog is a modern blog and portfolio platform built with Next.js, Prisma, and PostgreSQL.',
//             keywords: ['blog platform', 'portfolio', 'Next.js', 'Prisma', 'PostgreSQL', 'full-stack'],
//             canonicalUrl: '/projects/qblog',
//         },
//     });

// const project = await prisma.project.create({
//     data: {
//         title: 'QBlog Platform',
//         slug: 'qblog',
//         description: `# QBlog Platform

// QBlog is a modern blog and portfolio platform built with Next.js, Prisma, and PostgreSQL.

// ## Features

// - Responsive design optimized for all devices
// - SEO-friendly content management
// - Markdown support for blog posts
// - Image optimization
// - Portfolio showcase with categories
// - User authentication and authorization
// - Admin dashboard for content management

// ## Technologies Used

// - **Frontend**: Next.js, React, TailwindCSS
// - **Backend**: Next.js API routes, Prisma ORM
// - **Database**: PostgreSQL
// - **Authentication**: NextAuth.js
// - **Styling**: TailwindCSS
// - **Deployment**: Vercel

// ## Implementation Details

// The platform uses a modern JAMstack architecture with server-side rendering for optimal performance and SEO. Content is stored in a PostgreSQL database and accessed via the Prisma ORM.`,
//         images: [
//             '/assets/projects/qblog-home.webp',
//             '/assets/projects/qblog-blog.webp',
//             '/assets/projects/qblog-admin.webp'
//         ],
//         links: [
//             'https://github.com/quindart/qblog',
//             'https://qblog-demo.vercel.app'
//         ],
//         authorId: 1,
//         categoryId: 1,
//         id: 1,
//     },
// });

// console.log('Created project');

// console.log('Database has been seeded!');
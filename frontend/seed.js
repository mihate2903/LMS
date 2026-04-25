import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

const seedCourses = async () => {
  try {
    // 1. Đăng nhập Admin
    console.log("Đang đăng nhập admin...");
    const loginRes = await api.post('/auth/login', {
      email: 'admin@gmail.com',
      password: '123456'
    });
    const token = loginRes.data.token;
    console.log("Đăng nhập thành công!");

    // 2. Set token
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Lấy Categories
    const catRes = await api.get('/categories');
    const categories = catRes.data;
    if (!categories || categories.length === 0) {
      console.log("Database chưa có category nào. Vui lòng thêm Category trước!");
      return;
    }
    console.log(`Tìm thấy ${categories.length} danh mục.`);

    // 4. Dummy Courses (chọn random category)
    const dummyCourses = [
      {
        categoryId: categories[0].id,
        title: 'Lập trình Python từ cơ bản đến nâng cao (Mới)',
        price: 1290000,
        description: 'Khoá học toàn diện giúp bạn làm chủ ngôn ngữ lập trình Python trong 4 tuần. Giảng dạy từ biến, vòng lặp cơ bản cho đến OOP và xử lý Data.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop'
      },
      {
        categoryId: categories[0].id,
        title: 'Thiết kế Đồ họa với Photoshop 2024',
        price: 990000,
        description: 'Tự tin ứng tuyển vị trí Graphic Designer với bộ kỹ năng Photoshop thực chiến. Dạy cách xủ lý ảnh, typography, cắt ghép poster chuyên nghiệp.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop'
      },
      {
        categoryId: categories[0].id,
        title: 'Master ReactJS: Xây dựng dự án đồ sộ',
        price: 1599000,
        description: 'Học ReactJS chuyên sâu kết hợp TailwindCSS & Redux Toolkit. Thực hành xây dựng bản sao của Netflix và Spotify từ con số không.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop'
      },
      {
        categoryId: categories[0].id,
        title: 'Khởi nghiệp Kinh doanh Online thực chiến',
        price: 1850000,
        description: 'Bí mật tìm nguồn hàng ngách, tối ưu chi phí quảng cáo, và mở rộng quy mô kinh doanh không cần vốn lớn. Được hướng dẫn bởi chuyên gia nhiều năm kinh nghiệm.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=600&h=400&fit=crop'
      },
      {
        categoryId: categories[0].id,
        title: 'Nghệ thuật Giao tiếp & Thuyết trình Hấp dẫn',
        price: 650000,
        description: 'Đập tan nỗi sợ đám đông. Khóa học rèn luyện kỹ năng sân khấu, cách dùng body language và điều chế giọng nói (vocal variety) thu hút người nghe.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1475721028314-b1eb213de3a7?w=600&h=400&fit=crop'
      },
      {
        categoryId: categories[0].id,
        title: 'Đầu tư Chứng Khoán vỡ lòng cho người lười',
        price: 2100000,
        description: 'Khoá học phù hợp cho người đi làm 8 tiếng/ngày. Học cách đọc báo cáo tài chính, hiểu chỉ số kỹ thuật và tạo danh mục đầu tư an toàn dài hạn.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop'
      }
    ];

    // Thêm lần lượt
    console.log("Bắt đầu thêm " + dummyCourses.length + " khóa học...");
    for (const course of dummyCourses) {
      // Phân bổ Category ID ngẫu nhiên cho phong phú
      course.categoryId = categories[Math.floor(Math.random() * categories.length)].id;
      
      const res = await api.post('/courses', course);
      console.log(`✅ Thêm thành công: ${res.data.title}`);
    }

    console.log("🎉 Hoàn tất quá trình seed database.");
  } catch (error) {
    console.error("❌ Lỗi xảy ra:", error.response?.data || error.message);
  }
};

seedCourses();

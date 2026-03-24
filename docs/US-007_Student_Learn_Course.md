**Title: Khu vực Học tập và Xem Bài giảng (Learning Workspace)**

**Description:**
Với tư cách là Học viên, tôi muốn truy cập vào nội dung bài học (Video và Văn bản), để có thể tiếp thu kiến thức của khóa học mà tôi đã đăng ký.

**Acceptance Criteria:**
1. Hệ thống phải kiểm tra quyền truy cập: Chỉ những tài khoản có `role = student` và trạng thái ghi danh tại khóa học đó là `approved` mới được phép xem nội dung.
2. Nếu trạng thái ghi danh là `pending`, hệ thống phải chặn truy cập nội dung bài học và hiển thị thông báo: "Đăng ký của bạn đang chờ duyệt".
3. Giao diện bài học phải được thiết kế tối ưu: Khung phát Video (Video Player) nằm ở phần chính giữa/phía trên, và nội dung văn bản (Text) nằm ở phía dưới.
4. Video Player phải hỗ trợ phát mượt mà các link nhúng (embed URL) từ YouTube hoặc Vimeo.
5. Danh sách các bài học (Curriculum Sidebar) phải được hiển thị bên cạnh để học viên dễ dàng theo dõi và chuyển bài.
6. Hình ảnh và khung Video phải tự động co giãn (resize dynamically) để phù hợp với độ phân giải của cả PC, Tablet và Mobile.


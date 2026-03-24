**Title: Quản lý thông tin Khóa học (Course Management)**

**Description:**
Với tư cách là Quản trị viên (Admin), tôi muốn Thêm, Sửa, và Xóa thông tin các khóa học, để cập nhật danh sách sản phẩm bán trên Learning Portal.

**Acceptance Criteria:**
1. Trang quản lý khóa học phải hiển thị danh sách các khóa học dưới dạng bảng (Table) với các cột: Tên, Giá, Danh mục, và Hành động (Sửa/Xóa).
2. Form Thêm/Sửa khóa học phải bao gồm các trường nhập liệu: Tên khóa học, Giá bán, Mô tả chi tiết, Link ảnh đại diện (Thumbnail URL), và Dropdown chọn Danh mục (Category).
3. Hệ thống phải có Validation chặn việc nhập giá tiền âm (Giá phải >= 0).
4. Hành động "Xóa" khóa học phải xuất hiện một hộp thoại xác nhận (Confirmation Pop-up) để tránh việc Admin lỡ tay xóa nhầm dữ liệu quan trọng.
5. Mọi thay đổi phải được cập nhật ngay lập tức vào bảng `courses` trong Cơ sở dữ liệu.
6. Các API thực hiện chức năng này phải được bảo mật bằng JWT Token; nếu token không hợp lệ hoặc không phải quyền Admin, hệ thống phải từ chối yêu cầu (HTTP 403 Forbidden).


**Title: Ghi danh và Đăng ký mua Khóa học (Course Enrollment)**

**Description:**
Với tư cách là Học viên, tôi muốn điền form thông tin cá nhân, để gửi yêu cầu đăng ký mua một khóa học cụ thể trên hệ thống.

**Acceptance Criteria:**
1. Form đăng ký phải hiển thị rõ ràng các trường thông tin bắt buộc: Tên đầy đủ, Số điện thoại, và Email.
2. Nút "Xác nhận đăng ký" (Call-to-action) phải đủ lớn, dễ bấm trên thiết bị di động và sẽ bị vô hiệu hóa (disabled) nếu các trường bắt buộc chưa được điền đầy đủ.
3. Hệ thống phải kiểm tra tính hợp lệ của dữ liệu đầu vào (Data Validation): Email đúng định dạng (có ký tự @), SĐT đúng định dạng số.
4. Sau khi gửi form thành công, dữ liệu phải được lưu vào bảng `enrollments` trong Database với trạng thái mặc định là `pending`.
5. Giao diện phải hiển thị thông báo thành công (ví dụ: Pop-up hoặc Toast message) hướng dẫn học viên chờ Admin duyệt.
6. Form nhập liệu phải hiển thị tốt, không bị tràn viền hoặc cuộn ngang trên các thiết bị di động (Mobile Responsive).

**Priority:** High
**Effort Estimate:** Moderate

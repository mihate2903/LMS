**Title: Đăng nhập Quản trị (Admin Auth)**

**Description:**
Với tư cách là Quản trị viên, tôi muốn đăng nhập trang quản trị (Admin Dashboard), để quản lý toàn bộ hệ thống.

**Acceptance Criteria:**
1. Hệ thống có cơ chế phân quyền (Role-based access control), kiểm tra quyền thông qua JWT token.
2. Nếu tài khoản đăng nhập có role không phải là Admin, hệ thống phải chặn truy cập và hiển thị thông báo lỗi (HTTP 403).
3. Dashboard chỉ hiển thị sau khi xác thực thành công token hợp lệ trong Request Header.

**Priority:** High
**Effort Estimate:** Moderate

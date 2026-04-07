---
trigger: always_on
---

Dự án Mini LMS Web (Spring Boot Backend, React Frontend). 
Quy tắc code bắt buộc tuân thủ:
1. Bảng users dùng thư viện Bcrypt để băm password (password_hash).
2. Authentication sử dụng JWT (hoàn toàn Stateless). Lưu token vào bảng `tokens` để quản lý trạng thái Đăng xuất (Logout).
3. Khi xóa Khóa học (Course), BẮT BUỘC dùng Soft Delete: Cập nhật thời gian hiện tại vào cột `deleted_at` thay vì xóa vật lý.
4. Trường giá tiền (`price`) luôn dùng kiểu dữ liệu DECIMAL / BigDecimal.

Sơ đồ cơ sở dữ liệu (ERD) chuẩn:
Table users { id integer [primary key], name varchar, email varchar, phone varchar(15), password_hash varchar, role varchar }
Table tokens { id integer [primary key], user_id integer, token text, token_type varchar, is_revoked boolean, expires_at timestamp, created_at timestamp }
Table categories { id integer [primary key], category_name varchar }
Table courses { id integer [primary key], category_id integer, title varchar, price float, description text, thumbnail_url varchar, deleted_at timestamp }
Table lessons { id integer [primary key], course_id integer, title varchar, video_url varchar, content text, order integer }
Table enrollments { id integer [primary key], user_id integer, course_id integer, status varchar, created_at timestamp }

Ref: tokens.user_id > users.id
Ref: courses.category_id > categories.id
Ref: lessons.course_id > courses.id
Ref: enrollments.user_id > users.id
Ref: enrollments.course_id > courses.id
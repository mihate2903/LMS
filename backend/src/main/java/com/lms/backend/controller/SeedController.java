package com.lms.backend.controller;

import com.lms.backend.entity.Category;
import com.lms.backend.entity.Course;
import com.lms.backend.entity.User;
import com.lms.backend.repository.CategoryRepository;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
public class SeedController {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/extended")
    public ResponseEntity<String> seedExtendedCourses() {
        // Create Categories
        Category catDev = createOrGetCategory("Lập trình");
        Category catDesign = createOrGetCategory("Thiết kế Đồ họa");
        Category catBusiness = createOrGetCategory("Kinh doanh & Marketing");
        Category catFinance = createOrGetCategory("Tài chính & Đầu tư");
        Category catSoftSkill = createOrGetCategory("Kỹ năng mềm");

        List<Course> courses = Arrays.asList(
            Course.builder()
                .category(catDev)
                .title("Lập trình C++ cho người mới bắt đầu")
                .price(BigDecimal.valueOf(850000))
                .description("Khóa học C++ toàn diện từ số 0 đến làm chủ cấu trúc dữ liệu và giải thuật.")
                .thumbnailUrl("https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop")
                .build(),
            Course.builder()
                .category(catDesign)
                .title("Thiết kế UI/UX với Figma 2024")
                .price(BigDecimal.valueOf(1490000))
                .description("Học quy trình thiết kế UI/UX thực tế cùng các mẹo sử dụng Auto-Layout đỉnh cao trên Figma.")
                .thumbnailUrl("https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop")
                .build(),
            Course.builder()
                .category(catBusiness)
                .title("Digital Marketing Full-stack")
                .price(BigDecimal.valueOf(2500000))
                .description("Trở thành chuyên gia Digital Marketing với bộ kỹ năng SEO, Facebook Ads, Google Ads và Tiktok Ads.")
                .thumbnailUrl("https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop")
                .build(),
            Course.builder()
                .category(catFinance)
                .title("Quản lý tài chính cá nhân hiệu quả")
                .price(BigDecimal.valueOf(499000))
                .description("Giải pháp thoát khỏi cảnh cháy túi cuối tháng, học cách phân bổ thu nhập và lập quỹ tự do tài chính.")
                .thumbnailUrl("https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop")
                .build(),
            Course.builder()
                .category(catSoftSkill)
                .title("Quản lý thời gian & Năng suất x2")
                .price(BigDecimal.valueOf(550000))
                .description("Làm chủ phương pháp Pomodoro, ma trận Eisenhower để làm việc thông minh hơn thay vì chăm chỉ hơn.")
                .thumbnailUrl("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop")
                .build(),
             Course.builder()
                .category(catDesign)
                .title("Làm chủ Adobe Illustrator CC")
                .price(BigDecimal.valueOf(1100000))
                .description("Dựng hình 2D, thiết kế logo và vẽ minh họa vector chuyên nghiệp cùng Illustrator.")
                .thumbnailUrl("https://images.unsplash.com/photo-1626785724573-4b799315345d?w=600&h=400&fit=crop")
                .build(),
             Course.builder()
                .category(catDev)
                .title("Phát triển Game với Unity & C#")
                .price(BigDecimal.valueOf(1850000))
                .description("Làm game 2D/3D chuyên nghiệp. Thực hành qua việc xây dựng bản clone siêu mượt của Flappy Bird và Mario.")
                .thumbnailUrl("https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop")
                .build()
        );

        courseRepository.saveAll(courses);
        return ResponseEntity.ok("Seeded extended successfully!");
    }

    @GetMapping("/questions")
    public ResponseEntity<String> seedQuestions(@org.springframework.beans.factory.annotation.Autowired com.lms.backend.repository.LessonRepository lessonRepository, 
                                               @org.springframework.beans.factory.annotation.Autowired com.lms.backend.repository.QuestionRepository questionRepository) {
        // Tìm lesson đầu tiên
        com.lms.backend.entity.Lesson lesson = lessonRepository.findById(1L).orElse(null);
        if (lesson == null) {
            return ResponseEntity.badRequest().body("Vui lòng tạo khóa học và bài giảng trước!");
        }

        List<com.lms.backend.entity.Question> questions = Arrays.asList(
            com.lms.backend.entity.Question.builder()
                .lesson(lesson)
                .content("Ngôn ngữ chính được sử dụng để xây dựng cấu trúc của trang web là gì?")
                .optionA("CSS")
                .optionB("HTML")
                .optionC("JavaScript")
                .optionD("Python")
                .correctAnswer("B")
                .build(),
            com.lms.backend.entity.Question.builder()
                .lesson(lesson)
                .content("Bức ảnh nào sau đây có định dạng chuẩn để làm logo (hòa tan nền)?")
                .optionA(".JPG")
                .optionB(".PNG")
                .optionC(".MP4")
                .optionD(".PDF")
                .correctAnswer("B")
                .build(),
            com.lms.backend.entity.Question.builder()
                .lesson(lesson)
                .content("Ai là người sáng lập ra ReactJS?")
                .optionA("Google")
                .optionB("Twitter")
                .optionC("Meta (Facebook)")
                .optionD("Amazon")
                .correctAnswer("C")
                .build()
        );

        questionRepository.saveAll(questions);
        return ResponseEntity.ok("Seeded 3 questions into Lesson 1 successfully!");
    }

    @GetMapping("/users")
    public ResponseEntity<String> seedUsers() {
        // Danh sách user cần tạo
        List<Object[]> usersData = Arrays.asList(
            // [name, email, phone, password, role]
            new Object[]{"Nguyễn Minh Quân",   "quan123@gmail.com",   "0867568180", "123456", "ROLE_USER"},
            new Object[]{"Trần Thị Lan",       "lan.tran@gmail.com",  "0912345678", "123456", "ROLE_USER"},
            new Object[]{"Lê Văn Hùng",        "hung.le@gmail.com",   "0987654321", "123456", "ROLE_USER"},
            new Object[]{"Phạm Thu Hương",    "huong@gmail.com",     "0901234567", "123456", "ROLE_USER"},
            new Object[]{"Võ Đức Nam",        "nam.vo@gmail.com",    "0978001234", "123456", "ROLE_USER"},
            new Object[]{"Linh Hà Admin",      "admin@gmail.com",     "0901111111", "admin123", "ROLE_ADMIN"},
            new Object[]{"Super Admin",        "superadmin@lms.com", "0900000000", "admin@123", "ROLE_ADMIN"}
        );

        int created = 0;
        int skipped = 0;

        for (Object[] data : usersData) {
            String email = (String) data[1];
            if (userRepository.findByEmail(email).isPresent()) {
                skipped++;
                continue;
            }
            User user = User.builder()
                .name((String) data[0])
                .email(email)
                .phone((String) data[2])
                .passwordHash(passwordEncoder.encode((String) data[3]))
                .role((String) data[4])
                .build();
            userRepository.save(user);
            created++;
        }

        return ResponseEntity.ok(
            String.format("Seed users done! Created: %d, Skipped (already exists): %d", created, skipped)
        );
    }

    private Category createOrGetCategory(String name) {
        List<Category> all = categoryRepository.findAll();
        for (Category c : all) {
            if (c.getCategoryName().equalsIgnoreCase(name)) return c;
        }
        return categoryRepository.save(Category.builder().categoryName(name).build());
    }
}

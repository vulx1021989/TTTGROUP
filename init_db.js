const mysql = require('mysql2/promise');
require('dotenv').config();

// Cấu hình kết nối MySQL (Lấy từ .env hoặc mặc định)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
};

const DB_NAME = process.env.DB_NAME || 'ttt_technology_db';

async function initDatabase() {
    let connection;

    try {
        console.log('🔄 Đang kết nối tới MySQL Server...');
        // 1. Kết nối ban đầu tới MySQL server (chưa chỉ định database)
        connection = await mysql.createConnection(dbConfig);

        // 2. Tạo Database nếu chưa tồn tại
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`✅ Database "${DB_NAME}" đã sẵn sàng.`);

        // 3. Chuyển sang sử dụng Database vừa tạo
        await connection.changeUser({ database: DB_NAME });

        // 4. Lệnh SQL tạo bảng careers (Quản lý tin tuyển dụng)
        const createCareersTableSQL = `
            CREATE TABLE IF NOT EXISTS \`careers\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID vị trí tuyển dụng',
                \`title\` VARCHAR(255) NOT NULL COMMENT 'Tên vị trí tuyển dụng',
                \`location\` VARCHAR(255) NOT NULL COMMENT 'Địa điểm làm việc',
                \`type\` VARCHAR(100) DEFAULT 'Toàn thời gian' COMMENT 'Hình thức làm việc',
                \`description\` TEXT NULL COMMENT 'Mô tả công việc chi tiết',
                \`requirements\` TEXT NULL COMMENT 'Yêu cầu ứng viên',
                \`salary\` VARCHAR(100) NULL COMMENT 'Mức lương',
                \`status\` ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'Trạng thái đăng tuyển',
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý tin tuyển dụng';
        `;

        await connection.query(createCareersTableSQL);
        console.log('✅ Bảng "careers" đã được tạo thành công!');

        // 5. Lệnh SQL tạo bảng job_applications (Quản lý hồ sơ ứng viên)
        const createJobApplicationsTableSQL = `
            CREATE TABLE IF NOT EXISTS \`job_applications\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID hồ sơ ứng tuyển',
                \`full_name\` VARCHAR(100) NOT NULL COMMENT 'Họ và tên ứng viên',
                \`phone\` VARCHAR(20) NOT NULL COMMENT 'Số điện thoại liên hệ',
                \`email\` VARCHAR(100) NOT NULL COMMENT 'Email liên hệ',
                \`position\` VARCHAR(150) NOT NULL COMMENT 'Vị trí ứng tuyển',
                \`cv_file_path\` VARCHAR(255) NOT NULL COMMENT 'Đường dẫn/Tên file CV tải lên',
                \`cover_letter\` TEXT NULL COMMENT 'Giới thiệu ngắn / Lời nhắn',
                \`status\` ENUM('pending', 'reviewed', 'interviewed', 'accepted', 'rejected') DEFAULT 'pending' COMMENT 'Trạng thái xử lý',
                \`notes\` TEXT NULL COMMENT 'Ghi chú nội bộ của HR',
                \`ip_address\` VARCHAR(45) NULL COMMENT 'Địa chỉ IP người gửi',
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian nộp hồ sơ',
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật gần nhất',
                
                INDEX \`idx_position\` (\`position\`),
                INDEX \`idx_status\` (\`status\`),
                INDEX \`idx_created_at\` (\`created_at\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ hồ sơ ứng tuyển trực tuyến';
        `;

        await connection.query(createJobApplicationsTableSQL);
        console.log('✅ Bảng "job_applications" đã được tạo thành công!');

        // 6. Lệnh SQL tạo bảng contact_requests (Quản lý yêu cầu khảo sát & báo giá dịch vụ)
        const createContactRequestsTableSQL = `
            CREATE TABLE IF NOT EXISTS \`contact_requests\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID yêu cầu liên hệ',
                \`service_name\` VARCHAR(255) NOT NULL COMMENT 'Tên dịch vụ khách hàng yêu cầu',
                \`company\` VARCHAR(255) NOT NULL COMMENT 'Tên đơn vị / cơ sở / bệnh viện',
                \`name\` VARCHAR(150) NOT NULL COMMENT 'Họ và tên người đại diện',
                \`phone\` VARCHAR(50) NOT NULL COMMENT 'Số điện thoại liên hệ',
                \`facility_type\` VARCHAR(100) DEFAULT NULL COMMENT 'Loại hình cơ sở (Bệnh viện, Khu dân cư, Trường học...)',
                \`message\` TEXT DEFAULT NULL COMMENT 'Mô tả nhu cầu / công suất trạm / nội dung chi tiết',
                \`status\` ENUM('pending', 'processing', 'completed') DEFAULT 'pending' COMMENT 'Trạng thái xử lý yêu cầu',
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm gửi yêu cầu',

                INDEX \`idx_service_name\` (\`service_name\`),
                INDEX \`idx_status\` (\`status\`),
                INDEX \`idx_created_at\` (\`created_at\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ yêu cầu khảo sát và báo giá dịch vụ kỹ thuật';
        `;

        await connection.query(createContactRequestsTableSQL);
        console.log('✅ Bảng "contact_requests" đã được tạo thành công!');

        // 7. Chèn dữ liệu mẫu cho bảng careers nếu chưa có
        const [careerRows] = await connection.query('SELECT COUNT(*) as count FROM `careers`');
        if (careerRows[0].count === 0) {
            const sampleCareersSQL = `
                INSERT INTO \`careers\` (\`title\`, \`location\`, \`type\`, \`description\`, \`salary\`, \`status\`)
                VALUES 
                ('Kỹ Sư Vận Hành Xử Lý Nước Thải', 'TP. Hồ Chí Minh', 'Toàn thời gian', 'Trực tiếp vận hành, giám sát các hệ thống xử lý nước thải công nghiệp và sinh hoạt.', 'Thỏa thuận', 'active'),
                ('Kỹ Sư Thi Công Hạ Tầng Giao Thông', 'Các tỉnh miền Nam', 'Toàn thời gian', 'Lập kế hoạch, giám sát thi công các công trình đường giao thông, đảm bảo tiến độ kỹ thuật.', '15 - 25 Triệu', 'active'),
                ('Chuyên Viên Kinh Doanh Giải Pháp', 'Hà Nội & TP.HCM', 'Toàn thời gian', 'Tìm kiếm khách hàng, tư vấn các giải pháp chiếu sáng đô thị thông minh và hạ tầng kỹ thuật.', 'Cạnh tranh + Hoa hồng', 'active');
            `;
            await connection.query(sampleCareersSQL);
            console.log('📌 Đã thêm 3 bản ghi dữ liệu mẫu vị trí tuyển dụng.');
        }

        // 8. Chèn dữ liệu mẫu cho bảng job_applications nếu chưa có
        const [appRows] = await connection.query('SELECT COUNT(*) as count FROM `job_applications`');
        if (appRows[0].count === 0) {
            const sampleDataSQL = `
                INSERT INTO \`job_applications\` (\`full_name\`, \`phone\`, \`email\`, \`position\`, \`cv_file_path\`, \`cover_letter\`)
                VALUES (
                    'Nguyễn Văn A',
                    '0901234567',
                    'nguyenvana@gmail.com',
                    'Kỹ Sư Vận Hành Xử Lý Nước Thải',
                    'sample_cv.pdf',
                    'Tôi có 3 năm kinh nghiệm trong vận hành hệ thống xử lý nước thải công nghiệp.'
                );
            `;
            await connection.query(sampleDataSQL);
            console.log('📌 Đã thêm 1 bản ghi dữ liệu mẫu hồ sơ ứng tuyển.');
        }

        console.log('🚀 Khởi tạo Database hoàn tất!');

    } catch (error) {
        console.error('❌ Lỗi trong quá trình khởi tạo Database:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Đã đóng kết nối MySQL.');
        }
    }
}

// Chạy hàm khởi tạo
initDatabase();
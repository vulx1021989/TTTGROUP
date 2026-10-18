-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ttt_group_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `careers`
--

DROP TABLE IF EXISTS `careers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careers` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID vị trí tuyển dụng',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên vị trí tuyển dụng',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa điểm làm việc',
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Toàn thời gian' COMMENT 'Hình thức làm việc',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả công việc chi tiết',
  `requirements` text COLLATE utf8mb4_unicode_ci COMMENT 'Yêu cầu ứng viên',
  `salary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mức lương',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active' COMMENT 'Trạng thái đăng tuyển',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý tin tuyển dụng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careers`
--

LOCK TABLES `careers` WRITE;
/*!40000 ALTER TABLE `careers` DISABLE KEYS */;
INSERT INTO `careers` VALUES (1,'Kỹ Sư Vận Hành Xử Lý Nước Thải','TP. Hồ Chí Minh','Toàn thời gian','Trực tiếp vận hành, giám sát các hệ thống xử lý nước thải công nghiệp và sinh hoạt.',NULL,'Thỏa thuận','active','2026-10-14 08:10:15'),(2,'Kỹ Sư Thi Công Hạ Tầng Giao Thông','Các tỉnh miền Nam','Toàn thời gian','Lập kế hoạch, giám sát thi công các công trình đường giao thông, đảm bảo tiến độ kỹ thuật.',NULL,'15 - 25 Triệu','active','2026-10-14 08:10:15'),(3,'Chuyên Viên Kinh Doanh Giải Pháp','Hà Nội & TP.HCM','Toàn thời gian','Tìm kiếm khách hàng, tư vấn các giải pháp chiếu sáng đô thị thông minh và hạ tầng kỹ thuật.',NULL,'Cạnh tranh + Hoa hồng','active','2026-10-14 08:10:15');
/*!40000 ALTER TABLE `careers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_requests`
--

DROP TABLE IF EXISTS `contact_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_requests` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID yêu cầu liên hệ',
  `service_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên dịch vụ khách hàng yêu cầu',
  `company` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên đơn vị / cơ sở / bệnh viện',
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ và tên người đại diện',
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại liên hệ',
  `facility_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Loại hình cơ sở (Bệnh viện, Khu dân cư, Trường học...)',
  `message` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả nhu cầu / công suất trạm / nội dung chi tiết',
  `status` enum('pending','processing','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Trạng thái xử lý yêu cầu',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm gửi yêu cầu',
  PRIMARY KEY (`id`),
  KEY `idx_service_name` (`service_name`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ yêu cầu khảo sát và báo giá dịch vụ kỹ thuật';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_requests`
--

LOCK TABLES `contact_requests` WRITE;
/*!40000 ALTER TABLE `contact_requests` DISABLE KEYS */;
INSERT INTO `contact_requests` VALUES (2,'Duy Tu & Bảo Trì Hệ Thống Thoát Nước & Đường Giao Thông','Taka','Nguyễn Minh Phát','0338207739','Sua chua mat duong asphalt / vi he','Test something ','pending','2026-10-16 02:37:20'),(3,'Thiết Kế - Thi Công - Vận Hành Xử Lý Nước Thải','Monoko','Trần anh tuấn','0338207739','Khu dan cu / Do thi','Ok ','pending','2026-10-16 02:41:32'),(4,'Duy Tu & Bảo Trì Hệ Thống Thoát Nước & Đường Giao Thông','Vifaso','Hoangvu Hoang','0338207739','Sua chua mat duong asphalt / vi he','tét','pending','2026-10-16 07:38:06');
/*!40000 ALTER TABLE `contact_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','contacted','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (10,'test something','Vifaso',5,'0338207739','anhvuckm@gmail.com','ok','pending','2026-10-02 14:00:59','2026-10-02 14:00:59'),(11,'Hoangvu Hoang','Vifaso12',7,'0338207739','anhvuckm@gmail.com','adsada','pending','2026-10-02 14:02:42','2026-10-02 14:02:42'),(12,'Hoangvu Hoang','Vifaso',NULL,'0338207739','anhvuckm@gmail.com','dsadasda','pending','2026-10-02 14:03:09','2026-10-02 14:03:09'),(13,'Hoangvu Hoang','Vifaso',6,'0338207739','anhvuckm@gmail.com','tư vấn nhanh giúp tôi ','pending','2026-10-15 07:00:10','2026-10-15 07:00:10'),(14,'Hoangvu Hoang','Vifaso12',6,'0338207739','anhvuckm@gmail.com','Liên Hệ Tôi ','pending','2026-10-16 02:44:00','2026-10-16 02:44:00'),(15,'Hoangvu Hoang','Monoko',6,'0338207739','anhvuckm@gmail.com','test chức năng ','pending','2026-10-16 07:14:29','2026-10-16 07:14:29');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID hồ sơ ứng tuyển',
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ và tên ứng viên',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại liên hệ',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email liên hệ',
  `position` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Vị trí ứng tuyển',
  `cv_file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn/Tên file CV tải lên',
  `cover_letter` text COLLATE utf8mb4_unicode_ci COMMENT 'Giới thiệu ngắn / Lời nhắn',
  `status` enum('pending','reviewed','interviewed','accepted','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Trạng thái xử lý',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú nội bộ của HR',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ IP người gửi',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian nộp hồ sơ',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật gần nhất',
  PRIMARY KEY (`id`),
  KEY `idx_position` (`position`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ hồ sơ ứng tuyển trực tuyến';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (12,'Hoangvu Hoang','0338207739','anhvuckm@gmail.com','Phó Giám đốc  abcd','/uploads/cv/cv-1792034195826-919569934.pdf','abccsd','pending',NULL,'::ffff:127.0.0.1','2026-10-15 03:16:36','2026-10-15 03:16:36');
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (5,'Vận Hành & Bảo Trì Hệ Thống Kỹ Thuật Bệnh Viện','van-hanh-bao-tri-he-thong-ky-thuat-benh-vien','Dịch vụ Chăm sóc & Duy trì Cây xanh chuyên nghiệp cung cấp giải pháp toàn diện cho cảnh quan khu đô thị, nhà máy, khu công nghiệp, tòa nhà văn phòng và khu dân cư. Chúng tôi thực hiện định kỳ các hạng mục: cắt tỉa tạo hình, bón phân, phòng trừ sâu bệnh, tưới nước khoa học và làm cỏ dại, giúp khuôn viên cây xanh luôn xanh tươi, sinh trưởng phát triển tốt, mang lại không gian trong lành và cảnh quan thẩm mỹ cao cho toàn bộ công trình.',NULL,'published','2026-10-01 13:29:31','2026-10-14 02:35:09','landscaping'),(6,'Duy Tu Thoát Nước & Đường Giao Thông','duy-tu-thoat-nuoc-va-duong-giao-thong','TTT Technology cung cấp dịch vụ tổng thầu duy tu, bảo dưỡng hạ tầng kỹ thuật, hệ thống thoát nước đô thị - KCN và thảm nhựa đường giao thông uy tín, đạt chuẩn ISO 9001:2015. Liên hệ ngay!',NULL,'published','2026-10-01 13:30:36','2026-10-14 02:31:38','aircon'),(7,'Thiết Kế - Thi Công - Vận Hành Xử Lý Nước Thải','thiet-ke-thi-cong-van-hanh-xu-ly-nuoc-thai','Cung cấp giải pháp trọn gói từ tư vấn thiết kế, thi công lắp đặt hệ thống đến vận hành và bảo trì trạm xử lý nước thải cho khu công nghiệp, nhà máy, bệnh viện và khu đô thị. Ứng dụng công nghệ xử lý sinh học và hóa lý tiên tiến, đảm bảo nước thải sau xử lý đạt chuẩn QCVN, vận hành ổn định, tiết kiệm năng lượng và tối ưu chi phí đầu tư dài hạn.',NULL,'published','2026-10-01 13:31:42','2026-10-14 02:28:00','road');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_value` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'site_title','T?p ?oàn TTT - TTT Infrastructure','2026-09-28 11:17:13'),(2,'site_slogan','TTT Environmental Technology – Kiến tạo hạ tầng xanh, bền vững tương lai.','2026-10-17 04:47:01'),(3,'contact_email','congtymoitruonggr@gmail.com','2026-10-17 04:43:45'),(4,'hotline','+84 901 234 567','2026-09-28 11:17:13'),(5,'address','Tòa nhà TTT Tower, S? 123 ???ng Công Ngh?, Qu?n 1, TP. H? Chí Minh','2026-09-28 11:17:13'),(6,'maintenance_mode','0','2026-09-30 09:38:56'),(13,'site_name','Công Nghệ Môi Trường TTT','2026-10-17 04:44:15'),(15,'site_description','TTT Environmental Technology (Công Nghệ Môi Trường TTT) – Tổng thầu EPC uy tín chuyên cung cấp giải pháp xử lý nước thải, vận hành O&M và hạ tầng kỹ thuật tối ưu.','2026-10-17 04:47:20'),(17,'contact_hotline',' (84)  0946 117 878','2026-10-17 04:44:44'),(18,'contact_address','49, đường 60-TML, CÁT LÁI, HỒ CHÍ MINH','2026-10-17 04:41:22'),(20,'allow_guest_inquiry','0','2026-09-30 09:38:56');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'editor',
  `status` enum('active','locked') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'Ken12','anhvuckm@gmail.com','$2b$10$k9Xbhz8iwl8mHZtCO6l1JOfD777Y3PR2UzlbSlRf3WJcI3NMyPc82','Super Administrator','active','2026-09-30 01:32:30','2026-09-30 08:52:28'),(8,'adssd123','abcd@gmail.com','$2b$10$83bKkO.QOJoUzHf5pcGJe.2ZJy2NUhlEuHmiA78kNFpNxuQ.7PXmK','editor','active','2026-09-30 01:33:17','2026-09-30 08:52:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-18 12:25:12

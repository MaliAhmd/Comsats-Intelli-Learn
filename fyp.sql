-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2023 at 01:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fyp`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`) VALUES
(1, 'Admin', 'admin@admin.com', '12345678');

-- --------------------------------------------------------

--
-- Table structure for table `enrollstudent`
--

CREATE TABLE `enrollstudent` (
  `id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `student_regno` varchar(255) NOT NULL,
  `student_email` varchar(255) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollstudent`
--

INSERT INTO `enrollstudent` (`id`, `student_name`, `student_regno`, `student_email`, `tutor_id`, `user_id`) VALUES
(22, 'Muhammad Ali Ahmad', 'FA20-BSE-006', 'nnmnm@gmail.cpm', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tutor`
--

CREATE TABLE `tutor` (
  `id` int(11) NOT NULL,
  `tutor_name` varchar(255) DEFAULT NULL,
  `tutor_subject` varchar(255) DEFAULT NULL,
  `tutor_email` varchar(255) DEFAULT NULL,
  `tutor_password` varchar(255) DEFAULT NULL,
  `tutor_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutor`
--

INSERT INTO `tutor` (`id`, `tutor_name`, `tutor_subject`, `tutor_email`, `tutor_password`, `tutor_image`) VALUES
(4, 'Hammad q', 'ML', 'hammad@gmail.com', '$2b$10$OSDpvp1in5CphUpo467p5.Bw88Es2QsjTXsunMhjInsU0cQucC4Cm', ''),
(6, 'Abdullah', 'Software Testing', 'Abdullahahmad@gmail.com', '$2b$10$8bI.5Ot/YIBxRA8is4gYyur8Lst5QijFj.fmz2ju5Rw8HKXAsOHru', ''),
(7, 'Abdullah Ali', 'Software Testing', 'abdullahali@gmail.com', '$2b$10$PxQoqdgX9PD4Esy5IQntfe1AYW9BoHGsPokCHvMhgAdgpJxyIzpT.', ''),
(8, 'Zaheer', 'Calculus', 'zaheer@gmail.com', '$2b$10$iyw4SPGuhw7FjMeGRNPMcueco9Sf21/rQp8K4atp37cYtnEHj7eN2', ''),
(9, 'Saad', 'Software Testing', 'saad@gmail.com', '$2b$10$DAJjLxjaR0sTUdFj6iQKhOIOMm5YuOqnpCaX56kUuHXaBHx9YuUY6', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `regno` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `regno`, `password`, `email`) VALUES
(1, 'Muhammad', 'Ali Ahmad', 'FA20-BSE-006', '$2b$10$ML5YUIhwAYK4MTb3vKBo4elR5o3aCgs1tVkqtw6zss7P1VsUsWA.6', 'nnmnm@gmail.cpm'),
(2, 'Muhammad', 'Ali Ahmad', 'FA20-BSE-006', '$2b$10$RUVjs9H6XvGF2oMbjJbeVuCu2Cc6aBNa2jjE3lJ.KjsrreX8uW5.W', '@gmail.com'),
(3, 'Isha', 'Mal', 'FA20-BSE-013', '$2b$10$c2l8pyYDYSXnGWu9F4VjquKS36kzm2gsCFjwpYle4CAXoCpY8MQk.', '@gmail.com'),
(5, 'Eshan', 'Rubbani', 'FA20-BSE-005', '$2b$10$fvX2z0VWvRc1OAMIDOd95uLWM6UUYSQS.drAhOQxEl3xucJfGPKIy', ''),
(8, 'aaaa', 'abbb', 'FA20-BSE-00666', '$2b$10$QZO8Eh7ZQMAZWFPs9CMs8u6JHCe5dr2go2ZlWvC4PsXFR0mAVlFTu', 'ma4535230@gmail.com'),
(10, 'Ali', 'Rajput', 'FA20-BSE-001', '$2b$10$t7tStLtrCFawbHhr7m.lo.BNNly74IpiDmhF.NEDXc2MhIA9rxl7C', 'aliahmad@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `verifytutor`
--

CREATE TABLE `verifytutor` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `resume_file` varchar(255) DEFAULT NULL,
  `matrix_file` varchar(255) DEFAULT NULL,
  `intermediate_file` varchar(255) DEFAULT NULL,
  `bachelors_file` varchar(255) DEFAULT NULL,
  `tutorId` int(11) DEFAULT NULL,
  `t_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verifytutor`
--

INSERT INTO `verifytutor` (`id`, `name`, `email`, `bio`, `birthday`, `country`, `phone_no`, `resume_file`, `matrix_file`, `intermediate_file`, `bachelors_file`, `tutorId`, `t_image`) VALUES
(8, 'Abdullah', 'Abdullahahmad@gmail.com', 'I am Abdullah Ahmad ', '2023-12-16', 'Pakistan', '03090555415', '1702659072091-384645013.pdf', '1702659072114-981837919.pdf', '1702659072119-394725679.pdf', '1702659072124-569659598.pdf', 6, ''),
(9, 'Abdullah Ali', 'abdullahali@gmail.com', 'i Am Abdullah', '2023-12-02', 'Pakistan', '03090555415', '1702659328503-259209718.pdf', '1702659328519-288117123.pdf', '1702659328523-214353232.pdf', '1702659328524-135935231.pdf', 7, ''),
(10, 'Zaheer', 'zaheer@gmail.com', 'I  am Zaheer', '2023-12-02', 'Pakistan', '03090555415', '1702712500292-876263258.pdf', '1702712500327-702749912.pdf', '1702712500333-972649296.pdf', '1702712500334-436039226.pdf', 8, ''),
(11, 'Saad', 'saad@gmail.com', 'I Am Saad', '2023-12-02', 'Pakistan', '68453120', '1702713246958-12297103.pdf', '1702713246970-880157656.pdf', '1702713246973-557017139.pdf', '1702713246976-859091008.pdf', 9, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `enrollstudent`
--
ALTER TABLE `enrollstudent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Tests` (`tutor_id`),
  ADD KEY `Tests123` (`user_id`);

--
-- Indexes for table `tutor`
--
ALTER TABLE `tutor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tutor_email` (`tutor_email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `verifytutor`
--
ALTER TABLE `verifytutor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test` (`tutorId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enrollstudent`
--
ALTER TABLE `enrollstudent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tutor`
--
ALTER TABLE `tutor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `verifytutor`
--
ALTER TABLE `verifytutor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enrollstudent`
--
ALTER TABLE `enrollstudent`
  ADD CONSTRAINT `Tests` FOREIGN KEY (`tutor_id`) REFERENCES `tutor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Tests123` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `verifytutor`
--
ALTER TABLE `verifytutor`
  ADD CONSTRAINT `test` FOREIGN KEY (`tutorId`) REFERENCES `tutor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

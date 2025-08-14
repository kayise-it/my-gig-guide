/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.22-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: mygigguide
-- ------------------------------------------------------
-- Server version	10.6.22-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acl_trusts`
--

DROP TABLE IF EXISTS `acl_trusts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `acl_trusts` (
  `acl_id` int(11) NOT NULL AUTO_INCREMENT,
  `acl_name` varchar(255) NOT NULL,
  `acl_display` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`acl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_trusts`
--

LOCK TABLES `acl_trusts` WRITE;
/*!40000 ALTER TABLE `acl_trusts` DISABLE KEYS */;
INSERT INTO `acl_trusts` VALUES (1,'superuser','Superuser','2025-08-10 19:21:51','2025-08-10 19:21:51'),(2,'admin','Administrator','2025-08-10 19:21:51','2025-08-10 19:21:51'),(3,'artist','Artist','2025-08-10 19:21:51','2025-08-10 19:21:51'),(4,'organiser','Event Organiser','2025-08-10 19:21:51','2025-08-10 19:21:51'),(5,'venue','Venue Owner','2025-08-10 19:21:51','2025-08-10 19:21:51'),(6,'user','User','2025-08-10 19:21:51','2025-08-10 19:21:51');
/*!40000 ALTER TABLE `acl_trusts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `stage_name` varchar(255) NOT NULL,
  `real_name` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `settings` text DEFAULT NULL,
  `gallery` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `artists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (1,1,'Thando Vibes','Thando Hlophe','Afro Soul','An emerging voice in Afro Soul from Mpumalanga.','0721234567','https://instagram.com/thandovibes','https://facebook.com/thandovibes','https://twitter.com/thandovibes','/images/artists/thando.jpg',NULL,NULL,'2025-08-10 19:21:51','2025-08-10 19:21:51'),(2,2,'localtest5',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"setting_name\":\"Local Test 5\",\"path\":\"frontend/public/artists/\",\"folder_name\":\"3_localtest5_4945\"}',NULL,'2025-08-13 13:51:46','2025-08-13 13:51:46'),(3,3,'pink',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"setting_name\":\"pink\",\"path\":\"frontend/public/artists/\",\"folder_name\":\"3_pink_6179\"}',NULL,'2025-08-13 13:55:52','2025-08-13 13:55:52'),(4,4,'Primo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"setting_name\":\"Primo\",\"path\":\"frontend/public/artists/\",\"folder_name\":\"3_primo_6330\"}',NULL,'2025-08-13 13:58:30','2025-08-13 13:58:30');
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_artists`
--

DROP TABLE IF EXISTS `event_artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_artists` (
  `event_id` int(11) NOT NULL,
  `artist_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`event_id`,`artist_id`),
  UNIQUE KEY `event_artists_artist_id_event_id_unique` (`event_id`,`artist_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `event_artists_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_artists_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_artists`
--

LOCK TABLES `event_artists` WRITE;
/*!40000 ALTER TABLE `event_artists` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `owner_type` enum('artist','organiser') DEFAULT NULL,
  `organiser_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` datetime NOT NULL,
  `time` time NOT NULL,
  `price` float DEFAULT NULL,
  `ticket_url` varchar(255) DEFAULT NULL,
  `poster` varchar(255) DEFAULT NULL,
  `gallery` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'scheduled',
  `category` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `organiser_id` (`organiser_id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`organiser_id`) REFERENCES `organisers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `events_ibfk_3` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `organiserId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `organiserId` (`organiserId`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`organiserId`) REFERENCES `organisers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisers`
--

DROP TABLE IF EXISTS `organisers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `createdDate` datetime DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `settings` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisers`
--

LOCK TABLES `organisers` WRITE;
/*!40000 ALTER TABLE `organisers` DISABLE KEYS */;
/*!40000 ALTER TABLE `organisers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role` (`role`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `acl_trusts` (`acl_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Thando','thandov.hlophe@gmail.com','$2b$12$/rajhqOh6hqTRXJqTMbWr.iqGOAcoY73H/Msyy7GUq/o4/eqhOlEW',3,'2025-08-10 19:21:51','2025-08-10 19:21:51'),(2,'localtest5','localtest5@test.com','$2b$12$fMxkrYop3hwSWlGLozrLhO9Sfb6GudwxEdodItnRhkZ79OeB2xWzS',3,'2025-08-13 13:51:46','2025-08-13 13:51:46'),(3,'pink','pink@pink.com','$2b$12$F6Jzb4r9bU58AusJmKBQj.pmrPA5SLgbfexFZAebZkQUfBQc.gRke',3,'2025-08-13 13:55:52','2025-08-13 13:55:52'),(4,'Primo','primo@primo.com','$2b$12$.l642uZFbU4OgoMjvo5FlO2CfBLhPtv9Mp4uUOajcWfCyXnT04U0G',3,'2025-08-13 13:58:30','2025-08-13 13:58:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `owner_type` enum('artist','organiser') DEFAULT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact_email` (`contact_email`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `venues_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-13 16:07:26

-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: tworksdb
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

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
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20231203190658-add-otp-to-users.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin') NOT NULL,
  `profileImageUrl` varchar(255) DEFAULT NULL,
  `title` text,
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  `fileType` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messageId` (`messageId`),
  CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `channelMembers`
--

DROP TABLE IF EXISTS `channelMembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `channelMembers` (
  `userId` int NOT NULL,
  `channelId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`,`channelId`),
  UNIQUE KEY `channelMembers_channelId_userId_unique` (`userId`,`channelId`),
  KEY `channelId` (`channelId`),
  CONSTRAINT `channelMembers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `channelMembers_ibfk_2` FOREIGN KEY (`channelId`) REFERENCES `channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channelMembers`
--

LOCK TABLES `channelMembers` WRITE;
/*!40000 ALTER TABLE `channelMembers` DISABLE KEYS */;
/*!40000 ALTER TABLE `channelMembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `channels`
--

DROP TABLE IF EXISTS `channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `channels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channels`
--

LOCK TABLES `channels` WRITE;
/*!40000 ALTER TABLE `channels` DISABLE KEYS */;
/*!40000 ALTER TABLE `channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `legacys`
--

DROP TABLE IF EXISTS `legacys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legacys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectName` varchar(255) DEFAULT NULL,
  `description` text,
  `lead` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `newEndDate` varchar(255) DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','NA') DEFAULT NULL,
  `status` enum('NOT STARTED','ON HOLD','OVERDUE','IN PROGRESS','COMPLETED') DEFAULT NULL,
  `nextReview` varchar(255) DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `legacys_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legacys`
--

LOCK TABLES `legacys` WRITE;
/*!40000 ALTER TABLE `legacys` DISABLE KEYS */;
INSERT INTO `legacys` VALUES (1,'Zund press release','','Firoz','Varun','','NA','COMPLETED','',NULL,'2023-11-20 07:13:31','2023-11-20 07:13:31'),(2,'Community Hackathon','Conduct a hackathon/make-a-thon in June/July for 1-2 days for external participants. They will not stay in the premises though.','Firoz','Darshan','2023-09-17','HIGH','IN PROGRESS','2023-08-09',NULL,'2023-11-20 07:13:32','2023-11-20 07:13:32'),(3,'RIDP','Futher secondary research for finalising RIDP program','Firoz','Firoz','2023-08-17','HIGH','IN PROGRESS','2023-08-17',NULL,'2023-11-20 07:13:32','2023-11-20 07:13:32'),(4,'Hike letters','Issuing of hike letters to employees','Veera','Likhitha','2023-08-17','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:33','2023-11-20 07:13:33'),(5,'good vs bad design','','Veera','Tejaswini','2023-08-11','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:33','2023-11-20 07:13:33'),(6,'Posters - Come fail, Learn & Build ','Wall graphics','Veera','Swetha','2023-08-15','MEDIUM','COMPLETED','2023-08-10',NULL,'2023-11-20 07:13:34','2023-11-20 07:13:34'),(7,'AI workshops','Workshop on all tools available for AI','Veera','Tejaswini','2023-08-09','NA','COMPLETED','',NULL,'2023-11-20 07:13:34','2023-11-20 07:13:34'),(8,'Equipment  competition','Extended Zund challenge to all major equipment','Firoz','Varun','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:35','2023-11-20 07:13:35'),(9,'EA to CEO hire','Need to hire a EA to CEO','Anand','Anand','2023-07-28','HIGH','IN PROGRESS','2023-08-10',NULL,'2023-11-20 07:13:35','2023-11-20 07:13:35'),(10,'Internship completion letters ','Give internship completion letter to interns','Veera','Likhitha','2023-08-05','MEDIUM','COMPLETED','',NULL,'2023-11-20 07:13:36','2023-11-20 07:13:36'),(11,'Minister -response to funds letter','Letter authorising VCMD from PS and minister','Raj','Mythili','','HIGH','COMPLETED','2023-08-09',NULL,'2023-11-20 07:13:36','2023-11-20 07:13:36'),(12,'Exclusive T-Merch','Free, limited edition for staff only, generic merch for visitors/sale. Opening up a Merch vertical - Getting people to design objects + aligning in the same direction','Sanjay','Yoshita','','HIGH','NOT STARTED','2023-08-13',NULL,'2023-11-20 07:13:37','2023-11-20 07:13:37'),(13,'ERP Next','ERP implementation in the organisation','Firoz','Varun','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:37','2023-11-20 07:13:37'),(14,'Mementos (personalised, generic)','They make, we make. Mementos for guests and visitors at T-Works. Some can be personalised for important people.','Sanjay','Nehal','','HIGH','ON HOLD','',NULL,'2023-11-20 07:13:38','2023-11-20 07:13:38'),(15,'Sensor Lab','100 Cr procurement (Sensors + Actuators)','Sanjay','Madhav','','HIGH','ON HOLD','',NULL,'2023-11-20 07:13:38','2023-11-20 07:13:38'),(16,'Vertical stacking furniture for residents','Micro studios for the users renting the space - now would be a part of phase 1.5','Sanjay','Yoshita','','HIGH','ON HOLD','',NULL,'2023-11-20 07:13:39','2023-11-20 07:13:39'),(17,'Software interns','','Veera','Likhitha','','MEDIUM','COMPLETED','',NULL,'2023-11-20 07:13:39','2023-11-20 07:13:39'),(18,'Interim hike letters','To handover','Veera','Likhitha','','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:40','2023-11-20 07:13:40'),(19,'Designation changes to reflect','To handover','Veera','Likhitha','','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:40','2023-11-20 07:13:40'),(20,'ERP Vendor visit','ERP Vendor visit','Firoz','Varun','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:41','2023-11-20 07:13:41'),(21,'The Byte Bending Championship - T-Works Embedded Challenge','Held a two day challenge for participants ','Firoz','Darshan','2023-09-17','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:41','2023-11-20 07:13:41'),(22,'Org Structure','If the current reporting structure is entered into the ERP HR database, the org structure is created automatically. Please do this today.','Veera','Likhitha','2023-07-24','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:42','2023-11-20 07:13:42'),(23,'Workshops','Curriculum, Materials, Pipeline of trainers for conducting workshops/trainings','Veera','Tejaswini','','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:42','2023-11-20 07:13:42'),(24,'Lockheed Martin, Boeing introductions','Work with US consulate (Salil) for introductions for LM and Boeing','Veera','Anand','2023-08-22','HIGH','IN PROGRESS','2023-08-22',NULL,'2023-11-20 07:13:43','2023-11-20 07:13:43'),(25,'T-Works lettering in atrium','','Sanjay','Yoshita','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:43','2023-11-20 07:13:43'),(26,'72 hr challenge #2','Plan a second 72 hr challenge in August 2023','Firoz','Sharat','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:44','2023-11-20 07:13:44'),(27,'Grainpro','FTO study, prototype','Firoz','Firoz','2023-09-15','HIGH','NOT STARTED','2023-08-13',NULL,'2023-11-20 07:13:44','2023-11-20 07:13:44'),(28,'Drone racing','','Firoz','Firoz','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:45','2023-11-20 07:13:45'),(29,'Blogs, newsletters','release the edition every month through an emailer','Veera','Veera','','HIGH','IN PROGRESS','2023-08-08',NULL,'2023-11-20 07:13:45','2023-11-20 07:13:45'),(30,'Everyone should conduct a workshop atleast once','','Veera','Tejaswini','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:46','2023-11-20 07:13:46'),(31,'go full throttle  on ceramics workship','','Veera','Tejaswini','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:46','2023-11-20 07:13:46'),(32,'School kits (Maker Box)',' Maker box is a kit for school kids designed to stimulate thinking by providing access to a carefully curated selection of materials, technologies, and educational resources.','Sanjay','Akankasha','2023-09-30','MEDIUM','IN PROGRESS','2023-08-19',NULL,'2023-11-20 07:13:47','2023-11-20 07:13:47'),(33,'Funding (Opex) letter to Minister','Get letter reviewed and sent','Raj','Raj','2023-06-27','NA','COMPLETED','',NULL,'2023-11-20 07:13:47','2023-11-20 07:13:47'),(34,'battle bots','','Firoz','Firoz','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:48','2023-11-20 07:13:48'),(35,'Zund Challenge','Challenge the internal team to make something on the Zund through a competition','Sanjay','Shuja','2023-08-23','MEDIUM','COMPLETED','2023-08-23',NULL,'2023-11-20 07:13:48','2023-11-20 07:13:48'),(36,'Fundraising (Capex)','Continue raising remaining 20 Cr from industry (Amara Raja, Tejas Networks, Greenko)','Anand','Sharat','2023-08-09','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:13:49','2023-11-20 07:13:49'),(37,'Sujai review finances','Outflow, income, granular and macro','Raj','Raj','','MEDIUM','ON HOLD','',NULL,'2023-11-20 07:13:50','2023-11-20 07:13:50'),(38,'Change switches','Look, alignment','Meera','Meera','2023-07-31','MEDIUM','ON HOLD','2023-09-01',NULL,'2023-11-20 07:13:50','2023-11-20 07:13:50'),(39,'Rewards and Recognition','Need to roll out R&R. Don’t need a comprehensive total rewards policy, only a couple of initiatives to start with. Something like a spot award and a quarterly award.','Veera','Likhitha','2023-08-25','HIGH','ON HOLD','',NULL,'2023-11-20 07:13:51','2023-11-20 07:13:51'),(40,'Chief Secretary invitation','Letter inviting CS to T-Works and T-Fiber NoC','Anand','Anand','2023-07-21','NA','COMPLETED','',NULL,'2023-11-20 07:13:51','2023-11-20 07:13:51'),(41,'NDA for T-Works staff ','To protect the interests of external parties engaging with us.','Veera','Likhitha','2023-08-17','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:52','2023-11-20 07:13:52'),(42,'Apprenticeship for shops','','Firoz','Firoz','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:52','2023-11-20 07:13:52'),(43,'Library books','Funding, listing, procurement','Anand','Anand','2023-04-17','NA','ON HOLD','',NULL,'2023-11-20 07:13:53','2023-11-20 07:13:53'),(44,'Phone chargers in the board room','Board room, conf room, someplace in the lobby, powerbanks on rent','Meera','Meera','2023-07-22','NA','COMPLETED','',NULL,'2023-11-20 07:13:53','2023-11-20 07:13:53'),(45,'setup textile equipment','','Firoz','Varun','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:54','2023-11-20 07:13:54'),(46,'Chaiminar','A 72 hr challenge event to design and make a Irani chai making machine. Complete it for regular use','Sanjay','Firoz','2023-08-30','MEDIUM','NOT STARTED','2023-08-15',NULL,'2023-11-20 07:13:54','2023-11-20 07:13:54'),(47,'Friday Feature','time slot for internal team debates. Open to any topic related to T-Works and what we do.','Veera','Tejaswini','2023-08-25','MEDIUM','NOT STARTED','',NULL,'2023-11-20 07:13:55','2023-11-20 07:13:55'),(48,'Safety officer requirement','Reaching out to the safety institutes, sending proposal, negotiations','Veera','Likhitha','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:13:55','2023-11-20 07:13:55'),(49,'Agreements and legal','MOU\'s, NDA\'s and User agreement','Raj','Mythili','2023-07-31','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:13:56','2023-11-20 07:13:56'),(50,'Requesting mail access to Koundinya','*Mail access to Koundinya (Gmail)','Raj','Mythili','2023-08-22','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:56','2023-11-20 07:13:56'),(51,'ICE gate','Customs clearance','Raj','Syed','2023-07-28','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:57','2023-11-20 07:13:57'),(52,'SIRO Customs duty exemption process','Research about SIRO Customs duty, does it need more ?','Anand','Syed','2023-08-11','HIGH','COMPLETED','',NULL,'2023-11-20 07:13:57','2023-11-20 07:13:57'),(53,'PCB Fab setup','Setting up of the PCB fab sponsered by Qualcomm','Firoz','Varun','','HIGH','ON HOLD','',NULL,'2023-11-20 07:13:58','2023-11-20 07:13:58'),(54,'Phase 1 do up','Cleaning related to internal plantation','Meera','Meera','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:58','2023-11-20 07:13:58'),(55,'Note file, templates for procurement','Deviation for procurement policy, single vendor, service','Raj','Mythili','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:13:59','2023-11-20 07:13:59'),(56,'Projects with interns in other departments - Budget for consumable Electronic parts','Based on projections stocking of commonly used electronic parts across multiple disciplines','Sanjay','Madhav','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:13:59','2023-11-20 07:13:59'),(57,'Rate card','Review and sign-off on rate cards for rentals and proto services','Firoz','Firoz','2023-08-25','HIGH','ON HOLD','2023-08-11',NULL,'2023-11-20 07:14:00','2023-11-20 07:14:00'),(58,'Silver filigree','Designing and manufacturing machines to automate building blocks of filigree art form','Sanjay','Sharat','2023-09-25','HIGH','OVERDUE','',NULL,'2023-11-20 07:14:00','2023-11-20 07:14:00'),(59,'Dashcam','Enclosure design and low volume (12 units) prototyping','Sanjay','Sharat','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:01','2023-11-20 07:14:01'),(60,'Drone in a box','Product design and manufacturing of a drone-in-a-box platform','Sanjay','Sharat','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:01','2023-11-20 07:14:01'),(61,'Stewart platform','6-dof motion platform as a development kit','Sanjay','Sharat','','LOW','ON HOLD','',NULL,'2023-11-20 07:14:02','2023-11-20 07:14:02'),(62,'Smartbox','Asset tracking system that sends alerts when the box is opened; used for tracking sensitive question papers','Sanjay','Sharat','','LOW','IN PROGRESS','',NULL,'2023-11-20 07:14:02','2023-11-20 07:14:02'),(63,'Sprints - 2 axis delta PnP','a pick and place machine using vaccum ','Sanjay','Siva','2023-08-30','LOW','IN PROGRESS','',NULL,'2023-11-20 07:14:03','2023-11-20 07:14:03'),(64,'Sprints - Desktop mill','make an enlosure, finalise the electronics and make it functioning','Sanjay',' Nirmit','2023-08-21','LOW','IN PROGRESS','',NULL,'2023-11-20 07:14:03','2023-11-20 07:14:03'),(65,'Sprints - Segway','Self balancing vehicle','Sanjay','Absar','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:04','2023-11-20 07:14:04'),(66,'Sprints - Weld positioner','Jig for cicular objects','Sanjay','Yashwanth','2023-08-31','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:04','2023-11-20 07:14:04'),(67,'Reach out to academic institutions for engineering and management internships','Out of telangana search for interns','Veera','Likhitha','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:05','2023-11-20 07:14:05'),(68,'Assimilation plan','One week get-to-know the company plan. Need a document highlighting what we can do in one week.','Veera','Likhitha','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:05','2023-11-20 07:14:05'),(69,'ERP corrections','Trying to correct all the employee ID\'s','Veera','Likhitha','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:06','2023-11-20 07:14:06'),(70,'Graphic design interns','Reach out to colleges','Veera','Likhitha','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:06','2023-11-20 07:14:06'),(71,'Software experience people','','Veera','Likhitha','','MEDIUM','COMPLETED','',NULL,'2023-11-20 07:14:07','2023-11-20 07:14:07'),(72,'Build Web Page to capture Interview Feedbacks','','Veera','Likhitha','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:08','2023-11-20 07:14:08'),(73,'LoFi - Workshop','to host a workshop for external','Veera','Tejaswini','2023-09-28','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:08','2023-11-20 07:14:08'),(74,'World Skills','How can T-Works contribute/participate','Veera','Veera','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:09','2023-11-20 07:14:09'),(75,'Residency','','Veera','Veera','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:09','2023-11-20 07:14:09'),(76,'Carpenter upskilling','','Veera','Tejaswini','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:10','2023-11-20 07:14:10'),(77,'Media interviews','Arijit Burman ET','Veera','Veera','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:10','2023-11-20 07:14:10'),(78,'sketching course for internal team','Sketching 101 for internal product team especially for mech folks','Veera','Tejaswini','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:11','2023-11-20 07:14:11'),(79,'Training needs and identification','Gathering internal training requirements and finding suitable institutions and facilitated to the employess','Veera','Likhitha','','MEDIUM','NOT STARTED','',NULL,'2023-11-20 07:14:11','2023-11-20 07:14:11'),(80,'New Joinee PPT on Friday','Each Friday, along with usual activities (T-Debate etc), we can have a 5-10 min ppt by new joinees about what they do.','Veera','Likhitha','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:12','2023-11-20 07:14:12'),(81,'Employee handbook','We need an Employee Handbook for existing and new employees/interns to establish rules/guidelines/tips etc to accelerate the induction process.  ','Veera','Veera','','LOW','NOT STARTED','',NULL,'2023-11-20 07:14:12','2023-11-20 07:14:12'),(82,'Phase 1.5 conceptual art','setting a design direction for phase 1.5','Sanjay','Yoshita','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:13','2023-11-20 07:14:13'),(83,'Team office design','designing work benches and other supporting objects in the space','Sanjay','Yoshita','','LOW','IN PROGRESS','',NULL,'2023-11-20 07:14:13','2023-11-20 07:14:13'),(84,'Product Exhibition redesign','alternate design to the current product display','Sanjay','Yoshita','','MEDIUM','ON HOLD','',NULL,'2023-11-20 07:14:14','2023-11-20 07:14:14'),(85,'Zund storage system','a creative storage for the ARP made on the Zund','Sanjay','Yoshita','2023-09-29','LOW','IN PROGRESS','',NULL,'2023-11-20 07:14:14','2023-11-20 07:14:14'),(86,'Kinetic art installation','designing the event including community and in house staff','Sanjay','Yoshita','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:15','2023-11-20 07:14:15'),(87,'Sujai inaugural speech clips','','Veera','Veera','','HIGH','ON HOLD','',NULL,'2023-11-20 07:14:15','2023-11-20 07:14:15'),(88,'Improved Cookstove (ICS)','Design of an ICS with specific focus on design elements that makes the product user-friendly, efficient, and enviornmentally sustainable.','Sanjay','Simran','2023-09-30','MEDIUM','ON HOLD','',NULL,'2023-11-20 07:14:16','2023-11-20 07:14:16'),(89,'Atom ZLT Disaster Relief Kit (DRK)','Design of a kit that includes upto 32 essential items related to shelter, food, and sanitation that a family of 4 would need in a relief camp in the event of immediate displacement ffrom their home due to natural disasters and/or war.  ','Sanjay','Simran','2023-09-25','MEDIUM','ON HOLD','',NULL,'2023-11-20 07:14:16','2023-11-20 07:14:16'),(90,'Deloitte Scrolling White Board','Deloitte University requires a novel scrolling whiteboard design that can fit onto pillars in their training rooms. ','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-20 07:14:17','2023-11-20 07:14:17'),(91,'Trismus Rehab Device ','The device is used to rehab patients suffering from trismus. The client has a novel idea of adding a force sensor to allow patients to measure their progress in being able to re-open their jaw. ','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-20 07:14:17','2023-11-20 07:14:17'),(92,'UPS Industrial Design','client makes UPS and Inverters and would like help in the Industrial Redesign and addition of some features. ','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-20 07:14:18','2023-11-20 07:14:18'),(93,'Artificial Heart Design Improvements','client is making a novel permanent artificial heart design. Currently they have a PoC and are looking to improve their mechanical design to meet functional requirements','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-20 07:14:18','2023-11-20 07:14:18'),(94,'Deloitte Installation Repairs','There are two repairs to the DU Interaction Center which we are taking up:  1. William Deloitte Statue Hand Replacemement 2. Spinnign Wheel Redesign','Sanjay','Simran','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:19','2023-11-20 07:14:19'),(95,'CCMB Silicone Projects','There are two minor design projects from CCMB: 1. Silicone Tube for NeoNatal Care Machine Redesign and Moulding 2. Silicone Sleeve for C-Section Tool','Sanjay','Simran','','LOW','NOT STARTED','',NULL,'2023-11-20 07:14:19','2023-11-20 07:14:19'),(96,'Vacuum Chamber Usage for Bamboo Fiber Imfusion','client is looking to use the vacuum chamber at T-Works but requires a custom steel vessel. They are fabricating it but will need to do custom silicone sleeve design and some metal shop work.   ','Sanjay','Simran','','LOW','IN PROGRESS','',NULL,'2023-11-20 07:14:20','2023-11-20 07:14:20'),(97,'Flexible Materials Moulding ','Want to establish a flexible materials moulding lab to provide silicone and PU rubber moulding as an internal and external capability. ','Sanjay','Simran','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:20','2023-11-20 07:14:20'),(98,'SLA Printing Guideline','Need a handbook for training users on how to use the SLA printer. ','Firoz','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-20 07:14:21','2023-11-20 07:14:21'),(99,'MSME IPFC Application','Application to MSME IPR facilitation cell','Raj','Raj','2023-08-11','HIGH','ON HOLD','',NULL,'2023-11-20 07:14:21','2023-11-20 07:14:21'),(100,'Poster - POSH','Putting POSH  posters in the facility','Veera','Likhitha','','HIGH','ON HOLD','',NULL,'2023-11-20 07:14:22','2023-11-20 07:14:22'),(101,'Business modelling','Prepare a holistic business model with P&L projections','Veera','Tejaswini','','HIGH','ON HOLD','',NULL,'2023-11-20 07:14:22','2023-11-20 07:14:22'),(102,'Seed dropping pay load','Design and develop a seed ball dispensing drone payload','Sanjay','Shuja','2023-09-09','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:23','2023-11-20 07:14:23'),(103,'Saral web - Sclear','POS style attendance system for muncipality workers','Sanjay','Firoz','2023-09-06','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:23','2023-11-20 07:14:23'),(104,'Proto services','Services team to support inbound quiries','Firoz','Firoz','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:24','2023-11-20 07:14:24'),(105,'Liability/warranty agreements','For external users to use the space and equipment','Raj','Tejaswini','2023-07-31','HIGH','COMPLETED','',NULL,'2023-11-20 07:14:25','2023-11-20 07:14:25'),(106,'Achievements for FY 22-23','Solutions seekers and partnerships acheivements','Raj','Anurag','2023-07-29','HIGH','COMPLETED','',NULL,'2023-11-20 07:14:25','2023-11-20 07:14:25'),(107,'Sports.tworks','Internal sports activities. 6-a-side football, carrom, TT, basketball etc. Facilitate entry into inter-corporate tournaments in Hyd.','Veera','Likhitha','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:26','2023-11-20 07:14:26'),(108,'AIG Hospitals TNS box','The product is used to train doctors on how to perform a pituitary tumor resection through an endoscopic transsphenoidal approach.','Sanjay','Simran','','LOW','COMPLETED','',NULL,'2023-11-20 07:14:26','2023-11-20 07:14:26'),(109,'Board review PPT ','Update on the agenda items for board meeting on 3rd Aug','Anand','Anand','2023-08-03','HIGH','COMPLETED','',NULL,'2023-11-20 07:14:27','2023-11-20 07:14:27'),(110,'Souvenir design','designing  a souvenier that can be given to t-works guests','Sanjay','Yoshita','2023-08-25','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:27','2023-11-20 07:14:27'),(111,'CNC Circulation monitoring system','Accessory for HAAS','Sanjay','Madhav','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:28','2023-11-20 07:14:28'),(112,'Neo natal suction system','medical device for endotrechial suctioning process','Sanjay','Darshan','2023-08-19','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:28','2023-11-20 07:14:28'),(113,'Temperature caliberation system','temperature sensors and machining electronics needs to be validated with a wide range of temperature settings, this unit provides programmable temperatures','Sanjay','Suhas','','MEDIUM','IN PROGRESS','',NULL,'2023-11-20 07:14:29','2023-11-20 07:14:29'),(114,'CRIDA - Rover','Agricultural BOT, Navigate through farrow in raised bed farming','Sanjay','Madhav','','LOW','ON HOLD','',NULL,'2023-11-20 07:14:29','2023-11-20 07:14:29'),(115,'Chemo drug delivery system','bed side remote drug delivery system','Sanjay','Madhav','','LOW','ON HOLD','',NULL,'2023-11-20 07:14:30','2023-11-20 07:14:30'),(116,'Funding (CAPEX) - Rs.29 Cr','To get Funds from State Finance/Budget Section','Raj','Raj','2023-09-10','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:30','2023-11-20 07:14:30'),(117,'Entry and Exit gate Signages','Way finding signages at entry and exit gates','Meera','Meera','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:31','2023-11-20 07:14:31'),(118,'Vendor machine installation','Installation of vendor machine in T-Works facility','Meera','Padmini','2023-08-22','HIGH','COMPLETED','',NULL,'2023-11-20 07:14:31','2023-11-20 07:14:31'),(119,'Chaiminar movie','We hve a 34min movie on chaiminar. Have to break it up into 5 min clips with appropriate captions, titles etc.','Veera','Veera','','HIGH','NOT STARTED','',NULL,'2023-11-20 07:14:32','2023-11-20 07:14:32'),(120,'Project Management Portal','Make a in house portal which clearly defines team members on what their priority is, gives an idea about the workload to the management and where to hire people','Anand','Rahman','','HIGH','IN PROGRESS','',NULL,'2023-11-20 07:14:32','2023-11-20 07:14:32'),(121,'Remuneration structure review','','Veera','Veera','','NA','COMPLETED','',NULL,'2023-11-20 07:14:33','2023-11-20 07:14:33'),(122,'Product team mission','Articulate what we mean by prototype, what it is not etc','Sanjay','Sanjay','','NA','ON HOLD','',NULL,'2023-11-20 07:14:33','2023-11-20 07:14:33'),(123,'Logo design (T-Works logo) competition','','Sanjay','Swetha','','NA','ON HOLD','',NULL,'2023-11-20 07:14:34','2023-11-20 07:14:34'),(124,'VIP washroom','EAST side second floor washroom to be converted to VIP washroom','Meera','Meera','','NA','ON HOLD','',NULL,'2023-11-20 07:14:34','2023-11-20 07:14:34'),(125,'Structure over building','Conflict with phase 3? Art installations, internal artwork','Sanjay','Yoshita','','NA','ON HOLD','',NULL,'2023-11-20 07:14:35','2023-11-20 07:14:35'),(126,'Mat under urinal','Have to discuss','Meera','Meera','','NA','ON HOLD','',NULL,'2023-11-20 07:14:35','2023-11-20 07:14:35'),(127,'External lighting','Landscaping and roof lighting','Meera','Meera','','NA','ON HOLD','',NULL,'2023-11-20 07:14:36','2023-11-20 07:14:36'),(128,'Star ratings for external consultants, ecosystem partner vendors','','Firoz','Veera','','NA','NOT STARTED','',NULL,'2023-11-20 07:14:36','2023-11-20 07:14:36'),(129,'Aeroplane structure in atrium','','Firoz','Varun','','NA','ON HOLD','',NULL,'2023-11-20 07:14:37','2023-11-20 07:14:37'),(130,'Phase 1.5/2','Requirements, design, construction','Firoz','Meera','','NA','ON HOLD','',NULL,'2023-11-20 07:14:37','2023-11-20 07:14:37'),(131,'Ai Tour Guide','Industrial Design for AI Tour Guide, a handheld device that will guide visitors to go around T-Works.','Sanjay','Akankasha','2023-08-28','NA','IN PROGRESS','',NULL,'2023-11-20 07:14:38','2023-11-20 07:14:38'),(132,'Milk analyser','TFIR based milk analyser - building a benchtop POC in collab with their team','Sanjay','Sharat','','NA','IN PROGRESS','',NULL,'2023-11-20 07:14:38','2023-11-20 07:14:38'),(133,'T-Works University','','Veera','Tejaswini','','NA','ON HOLD','',NULL,'2023-11-20 07:14:39','2023-11-20 07:14:39'),(134,'Creating an external services roster of designers, engineers, fabricators etc','','Sanjay','Sanjay','','NA','COMPLETED','',NULL,'2023-11-20 07:14:39','2023-11-20 07:14:39');
/*!40000 ALTER TABLE `legacys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `userId` int DEFAULT NULL,
  `channelId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `channelId` (`channelId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`channelId`) REFERENCES `channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectName` varchar(255) DEFAULT NULL,
  `description` text,
  `lead` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `newEndDate` varchar(255) DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','NA') DEFAULT NULL,
  `status` enum('NOT STARTED','ON HOLD','OVERDUE','IN PROGRESS','COMPLETED') DEFAULT NULL,
  `nextReview` varchar(255) DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `leadId` int DEFAULT NULL,
  `ownerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  KEY `leadId` (`leadId`),
  KEY `ownerId` (`ownerId`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`leadId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `messageId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`messageId`,`userId`),
  UNIQUE KEY `tags_userId_messageId_unique` (`messageId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tags_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) DEFAULT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Lead','Owner','User') DEFAULT 'User',
  `title` text,
  `profileImage` varchar(255) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `otp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `displayName` (`displayName`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin T-WORKS','Admin','admin@tworks.in',NULL,'$2b$10$K1mOP6kpmx8h5SEyVzY1veowstcAElMBRMhhBPuzW9Y1tGnuM2zCC','Admin','Administrator','https://res.cloudinary.com/dksonaea5/image/upload/v1701024763/uqpevfxuxpqedx3inyjy.png','2023-12-03 20:03:58','2023-11-20 07:09:04','2023-12-03 20:03:58',NULL),(2,'Anand Rajagaopalan','Anand','anand@tworks.in','+919849365735','$2b$10$P2OHJdB8hSlwamDxrq.aG.6eoLkDaY452nEQiwJ4QLpJDQ3ZVChja','Lead','Vice President, Operations','https://res.cloudinary.com/dksonaea5/image/upload/v1701623502/vqrfu98bkeexbxs7tlzl.png','2023-12-03 17:21:05','2023-11-20 07:09:04','2023-12-03 17:21:05',NULL),(3,'Sanjay Gajjala','Sanjay','sanjay@tworks.in','+919989926313','$2b$10$3/Z8WKsxEwg3GPtZSOj3f.ITL0FyJtSjTg0eHzC9dWKP6csN0mBjq','Lead','Sr.Director - Product Engineering','https://res.cloudinary.com/dksonaea5/image/upload/v1701393176/xminl7rvelhvsxfxvcud.png','2023-12-02 16:03:36','2023-11-20 07:09:05','2023-12-02 16:03:36',NULL),(4,'Varun Sivaram','Varun','varun@tworks.in',NULL,'$2b$10$16kbB6sD28xDMv1VhsGRduUNkawn8BbkFBXLpAKFaLAG8/N1iS9He','User','Architect - Prototype Infrastructure',NULL,NULL,'2023-11-20 07:09:05','2023-11-26 18:52:26',NULL),(5,'Firoz Ahammad','Firoz','firoz@tworks.in','+919700169649','$2b$10$G.HaWFKjaGkeCrSmLbaOCuBsSj2zJr154y4NtyV6/ABiVSDIiy5.2','Lead','Director- Technical','https://res.cloudinary.com/dksonaea5/image/upload/v1701024826/fxtohglgvsdln5ngrser.png','2023-11-30 23:49:22','2023-11-20 07:09:06','2023-11-30 23:49:22',NULL),(6,'Sharat Chander Reddy','Sharat','sharat@tworks.in',NULL,'$2b$10$xj8gXnyBOnOguGABmtmwg.fAByUjSVbxhEv1NheKSAoZQcqM6KHhK','User','Senior Product Manager',NULL,NULL,'2023-11-20 07:09:07','2023-11-20 07:09:07',NULL),(7,'Simran Singh Wasu','Simran','simran@tworks.in',NULL,'$2b$10$s2UcWwf6.aW8gxw9D.iZcOEN9v2MnjPE3QMOlR30SgxFUbF96/fti','User','Product Manager',NULL,NULL,'2023-11-20 07:09:07','2023-11-20 07:09:07',NULL),(8,'Abdur Rahman S','Rahman','rahman@tworks.in',NULL,'$2b$10$0dkz.20JIhBzA1CVyn9dcu05mJY5mCUz63sBOgYyxQJKOlgiNlv1W','User','Lead Software Engineer',NULL,NULL,'2023-11-20 07:09:08','2023-11-20 07:09:08',NULL),(9,'Madhav Tennati','Madhav','madhav@tworks.in',NULL,'$2b$10$TmLpa4TygPDyakVvcV9ZBOeJoRQTuuiqB4KnANDeUKICIEdQAWKgy','User','Chief Product Architect',NULL,NULL,'2023-11-20 07:09:08','2023-11-20 07:09:08',NULL),(10,'Niharika Dama','Niharika','niharika@tworks.in',NULL,'$2b$10$AL1OCVj3Xf0g9KaBya.WlO0N9K3FCappTnWogN.dNAMvnx5N8RlqC','User','Senior Executive -Finance & Accounting',NULL,NULL,'2023-11-20 07:09:09','2023-11-20 07:09:09',NULL),(11,'Sheik Khadeer','Khadeer','Khadeer@tworks.in',NULL,'$2b$10$farAe4Zv3r45wZvZDvIAxePO.q8GSrpzlxEt3n4zKXY4j0cjYgG8i','User','Senior Engineer - Mechanical',NULL,NULL,'2023-11-20 07:09:09','2023-11-20 07:09:09',NULL),(12,'Syed Shanawaz','Syed','syed@tworks.in',NULL,'$2b$10$pfSJdGC15urcZIxShr76e.2Yt58QnXcq4hb8l83D.QA3XLLjSjXYK','User','Assistant Manager - Procurement',NULL,NULL,'2023-11-20 07:09:10','2023-11-20 07:09:10',NULL),(13,'Likhitha Maashetty','Likhitha','likhitha@tworks.in',NULL,'$2b$10$ggF5SSmmtPvP/iccuJ6yOewwp2Xg3WjM5wftHVmFqN/Sdtz4Pyc5q','User','Senior Executive- Human Resources',NULL,NULL,'2023-11-20 07:09:11','2023-11-20 07:09:11',NULL),(14,'Anirudh Koteshwaran','Anirudh','Anirudh@tworks.in',NULL,'$2b$10$Bmt08WA.384kHnRkdgTaWeFD.vx3z45fnKrAa.ANUGguDCXfZR6Oy','User','Furniture & Spatial Designer',NULL,NULL,'2023-11-20 07:09:11','2023-11-20 07:09:11',NULL),(15,'Absar Ul Haq Syed ','Absar','absar@tworks.in',NULL,'$2b$10$Bza//U5MCRAoIeXEfGzXOeMDEoZJKXAFCXK1WdEVgA1//ge5D8/rC','User','Prototyping Design Engineer',NULL,NULL,'2023-11-20 07:09:12','2023-11-20 07:09:12',NULL),(16,'Raj Shekhar Vadlamani','Raj','rajshekhar@tworks.in','+919849994650','$2b$10$lnL6R6.2qksApdrnl8GfVuO2DU6yiZm1tNHVKUmkyGo6h90EeKHn2','Lead','Finance Controller - Finance & Accounting',NULL,NULL,'2023-11-20 07:09:12','2023-11-20 07:09:12',NULL),(17,'Mohammed Talha Adil','Adil','adil@tworks.in',NULL,'$2b$10$WLdohoy8fRNJvxnZUn5rcu0eL9qgtGsu7cxIJiY5KSl1Vqz7fuw4u','User','Lead Prototyping Engineer',NULL,NULL,'2023-11-20 07:09:13','2023-11-20 07:09:13',NULL),(18,'Lakshman Batthula','Lakshman','lakshman@tworks.in',NULL,'$2b$10$JRUR4pksGrnjKczPPNiD1um2Y2iSUhBgYP01SUx7m3HodrIGUZMP.','User','PCB Layout Design Engineer',NULL,NULL,'2023-11-20 07:09:14','2023-11-20 07:09:14',NULL),(19,'Anurag Velury','Anurag','anurag@tworks.in',NULL,'$2b$10$whUcXGOyBdGix8zSyWdvpeYQsONCpNVfcQnlkYvJWY04XBwhh44Aa','User','Lead - Growth & Partnerships',NULL,NULL,'2023-11-20 07:09:14','2023-11-20 07:09:14',NULL),(20,'Tejaswini Kidambi','Tejaswini','tejaswini@tworks.in',NULL,'$2b$10$qXm6mUGoALW.IlziKcI7oufhBCmV0AhftMGGB6sH7oJz3dpPbL3da','User','Business Development Manager',NULL,NULL,'2023-11-20 07:09:15','2023-11-20 07:09:15',NULL),(21,'Koppu Santhosh','Santosh','santhosh@tworks.in',NULL,'$2b$10$vk93FPU/cs9dKr2dbXusQOZeza0ShHuksYm6KQBjxdCil7rFxtA3a','User','Senior Engineer - Facility Maintainance Engineer',NULL,NULL,'2023-11-20 07:09:15','2023-11-20 07:09:15',NULL),(22,'Mohammad Meera Mohiddin','Meera','meera@tworks.in','+918185014342','$2b$10$FR12dI/PFoDCBAOMKwZ5wOKzkzT2MycUY6WHNNDxr3mOXHIjHUDvG','Lead','Assoclate Director - Plant Maintenance & Facilities','https://res.cloudinary.com/dksonaea5/image/upload/v1701074741/rtd7jvebvfn44lrqmqba.jpg','2023-11-30 23:48:08','2023-11-20 07:09:16','2023-11-30 23:48:08',NULL),(23,'Shuja Ahmed Khan Suri','Shuja','shuja@tworks.in',NULL,'$2b$10$a/YcWpin5VRSL.nwYkyAbOauWC/CRUnmdVlT0sCnZrOQd26w3oyee','User','Assistant Manager - Aeronautical ',NULL,NULL,'2023-11-20 07:09:16','2023-11-20 07:09:16',NULL),(24,'Mythili Addepalli','Mythili','mythili@tworks.in',NULL,'$2b$10$Bw3cHfHoUzvOa68AStT6ZOK9ERrILXpiJ884dKH7QD/qSQ14jg3Gi','User','Lead - Finance & Accounting',NULL,NULL,'2023-11-20 07:09:17','2023-11-20 07:09:17',NULL),(25,'Damodar Darshan Kolla','Darshan','darshan@tworks.in',NULL,'$2b$10$SkK1UWPpcRGcJBgl.t0kmeSt0Le6BkXelkw1VUcVqgh/AJlUOfu3G','User','Associate -Engineer Electronics',NULL,NULL,'2023-11-20 07:09:18','2023-11-20 07:09:18',NULL),(26,'Manish Gunasekaran','Manish','manishgunasekaran@tworks.in',NULL,'$2b$10$7blCcbqlmkatYIuT4jwi/ud5RlzRPtt4ehu9BSCHkB.1bWGe3DFla','User','Senior Prototype Design Engineer',NULL,NULL,'2023-11-20 07:09:18','2023-11-20 07:09:18',NULL),(27,'Padmini Vuppala','Padmini','vuppalapadmini@tworks.in',NULL,'$2b$10$ulSiQ5AfgOxSc1guxcCU2er4F7gHMWn0wVZtU1yZ0jpPZPSxACY.O','User','Admin Assistant Manager',NULL,NULL,'2023-11-20 07:09:19','2023-11-20 07:09:19',NULL),(28,'Yoshita Lakshmi Pinjala','Yoshita','yoshita@tworks.in',NULL,'$2b$10$J4N75raAVfYNjB3v6VCEl.HbBdkahkMJSC8D86Egscn8Es0q8PQQ6','User','Lead - Contextual & Spatial Designer',NULL,NULL,'2023-11-20 07:09:19','2023-11-20 07:09:19',NULL),(29,'Rahil Hasan','Rahil','rahilhasan@tworks.in',NULL,'$2b$10$Jwnpta0RUnL6ndLzdfDJPO.1Vo16ljWO9eYGiKRc0FfddedJadt.u','User','Designer',NULL,NULL,'2023-11-20 07:09:20','2023-11-20 07:09:20',NULL),(30,'Yashwanth Vudathu','Yashwanth','yashwanthvudathu@tworks.in',NULL,'$2b$10$HnDzh7URjO96Bk1ABoqXyOeqFUFmpuK07aBjcWtpjxSuQ6256SHwe','User','Rapid Prototyping Specialist',NULL,NULL,'2023-11-20 07:09:20','2023-11-20 07:09:20',NULL),(31,'Riddi Rao Cherla','Riddi','riddi@tworks.in',NULL,'$2b$10$Kv.og/ZpJwv6m62DpT2SVOoRTqYTw.aRhg4mJPcJ58eIyW5GDMOT.','User','Prototype Design Engineer',NULL,NULL,'2023-11-20 07:09:21','2023-11-20 07:09:21',NULL),(32,'Gopi Krishna Gontiyala','Gopi','gopikrishna@tworks.in',NULL,'$2b$10$8qRUhU8Ct88.LHtnzfvZy.nrYxCP7UJoxxGQlbxp6BXoX.NuaCvHe','User','Procurement Specialist',NULL,NULL,'2023-11-20 07:09:22','2023-11-20 07:09:22',NULL),(33,'Naomi Kundu','Naomi','naomi@tworks.in',NULL,'$2b$10$L/QwtefMDXEkkXhVmFelxuqZFYcOr7Kmmf1fX/o2tVMU40YeCD79W','User','Pottery Studio Manager',NULL,NULL,'2023-11-20 07:09:22','2023-11-20 07:09:22',NULL),(34,'Ankush Goyal','Ankush','ankush@tworks.in',NULL,'$2b$10$4CsNp05vYy/0IdxzgWdg/u4W.CfPZxrnTSSMb5vCNxzHsOqTbq9DC','User','Senior Electronics Engineer',NULL,NULL,'2023-11-20 07:09:23','2023-11-20 07:09:23',NULL),(35,'Gaduthuri John Nitin Joshee','Nitin','j.nitin@tworks.in',NULL,'$2b$10$AEDDCSpLC8Cy8RlHPKlGxO6yCy3ILv4K/tu/d2dr9.uwSM0mWUhKK','User','Associate Engineer- Rapid Prototyping',NULL,NULL,'2023-11-20 07:09:23','2023-11-20 07:09:23',NULL),(36,'Veerabhadra Rao chappi','Veera','veera@tworks.in','+919866661553','$2b$10$2jwOS9YdOGsXFGGcBCV3ZO/CndcSwG/eG3dIlZe/2FyRv7TU7o5Ue','Lead','Director - Partnership People and Culture',NULL,NULL,'2023-11-20 07:09:24','2023-11-20 07:09:24',NULL),(37,'Nehal Sarangkar','Nehal','nehal@tworks.in',NULL,'$2b$10$MPSaAO/bXdqHcEHcy5jmuu2pwctfwcQDi0MM1bd4MOCK/oPkCEKNK','User','Senior - Prototype Design Engineer',NULL,NULL,'2023-11-20 07:09:25','2023-11-20 07:09:25',NULL),(38,'Akankasha Joharapurkar','Akankasha','akanksha@tworks.in',NULL,'$2b$10$/KsL7XpBO/sC60tfwhRzM.tZI303HLEhhMKwJkHwhaDeoFa1LAFUu','User','Senior - Industrial Designer',NULL,NULL,'2023-11-20 07:09:25','2023-11-20 07:09:25',NULL),(39,'Masrath Sultana','Masrath','masrathsultana@tworks.in','+918465079938','$2b$10$.P.9uuseI9UqmtQrsU7IfOlj59oB02RnTF0j8sssZUutVWlLiDw1y','User','Associate Prototype Design Engineer',NULL,NULL,'2023-11-20 07:09:26','2023-11-20 07:09:26',NULL),(40,'Rahul Reddy Amireddy','Rahul','rahul@tworks.in',NULL,'$2b$10$OWbxU2Ouz4Jc9cJpOv0l7OgbvQWuJYYYRItK6sDJu5xjEmnfXjhcO','User','Associate Engineer',NULL,NULL,'2023-11-20 07:09:26','2023-11-20 07:09:26',NULL),(41,'Nirmit Naha','Nirmit','nirmit@tworks.in',NULL,'$2b$10$XweWZooAyt.wvW7jLQEB4..t42HJnkLJ3ibZf84UcKv0cEu30JQDO','User','Associate Prototype Design Engineer',NULL,NULL,'2023-11-20 07:09:27','2023-11-20 07:09:27',NULL),(42,'Swetha Maniyoor','Swetha','maniyoorswetha@tworks.in',NULL,'$2b$10$o80ArAY4t50PI82jp2XaXOUWOwWotF0akFakrUtVh/bLWHMKfMaxi','User','Graphic designer',NULL,NULL,'2023-11-20 07:09:27','2023-11-20 07:09:27',NULL),(43,'Raj Kumar Sharma','Raj Kumar','rajkumar.s@tworks.in',NULL,'$2b$10$gJhIh8yBHhj2vzRYb.CAt.a9XNzyxQhdqDCc7Go6Nn1vjUvLeuw..','User','Apprentice',NULL,NULL,'2023-11-20 07:09:28','2023-11-20 07:09:28',NULL),(44,'Patlolla Suhas','Suhas','suhaspatlolla@tworks.in',NULL,'$2b$10$TWeGbBdL4yyDvFVVSsSaO.wi6dHdeTLCGdw.fCmwBVZUuxiaA4.yG','User','Associe - Engineer Electronics',NULL,NULL,'2023-11-20 07:09:29','2023-11-20 07:09:29',NULL),(45,'Oorja Shettigari','Oorja','oorja@tworks.in',NULL,'$2b$10$8huewB2Of7Bztln2muqetee68TFVrOY0ffYYm1m1sKhQ663LpF1MO','User','Associate- Textile Designer',NULL,NULL,'2023-11-20 07:09:29','2023-11-20 07:09:29',NULL),(46,'Kaithi Poojith Raj Patel','Poojith','poojith@tworks.in',NULL,'$2b$10$9CDOzWHS35TVtYdC92fU/elMVBBJdItIYBq6KjE6itz0/barwnxYm','User','3D Printing Apprentice',NULL,NULL,'2023-11-20 07:09:30','2023-11-20 07:09:30',NULL),(47,'Aluru V Siva Charana Datta ','Siva','shivacharan@tworks.in',NULL,'$2b$10$PyXKkFHbqjoEVPD19hPqhuqc/l.IyKTbQkJ7Dp03aWFPQhOVHlxu6','User','Associate - Prototype Design Engineer',NULL,NULL,'2023-11-20 07:09:30','2023-11-20 07:09:30',NULL),(48,'Ravariya Ashleshaben Jagdishbhai','Ravariya','ravi@tworks.in',NULL,'$2b$10$ZC69ZuygYzXAPWv9RR77ceQAMAZnMyDe6jkmAf33TCLa/YUCidJTK','User','Associate- Ceramic Craft',NULL,NULL,'2023-11-20 07:09:31','2023-11-20 07:09:31',NULL),(49,'Atkuri Sai Nikhila','Nikhila','sainikhila@tworks.in','+919390647305','$2b$10$tNYzgiSnl5gvMP1pQATY1eYMOeAqIlceOOGdjj/erwaRw3e6BQr2m','User','Associate- Full Stack Developer',NULL,NULL,'2023-11-20 07:09:31','2023-11-20 07:09:31',NULL),(50,'Avala Dhanush Reddy ','Dhanush','dhanush@tworks.in',NULL,'$2b$10$egbFk41gr2t6QiXnyPK6m.XK63vljXObfbl8qR6vajckwo1DwZOP6','User','Associate - Prototype Design Engineer',NULL,NULL,'2023-11-20 07:09:32','2023-11-20 07:09:32',NULL),(51,'Shreyans Harsora','Shreyans','shreyans@tworks.in',NULL,'$2b$10$8KfmhvOG04qdd2Ryst5hfubrF9xK6QTHvszXnSc3.Ucfx43Zck//u','User','Associate - Product Designer',NULL,NULL,'2023-11-20 07:09:33','2023-11-20 07:09:33',NULL),(52,'Jatin Arrvapalli','Jatin','jatin@tworks.in',NULL,'$2b$10$/clFQhbofHieUyeZ3g5UgOrISXfk4knbvTmR1jq1n5AYSbgfjYPRG','User','External Consultant',NULL,NULL,'2023-11-20 07:09:33','2023-11-20 07:09:33',NULL),(53,'Chetan','Chetan','chetan@tworks.in',NULL,'$2b$10$aXcSWlU31GqnDcILcJFUMuYzRYJeYCjN15GY5sl0w9A8TkGnsmxrO','User','External Consultant',NULL,NULL,'2023-11-20 07:09:34','2023-11-20 07:09:34',NULL),(54,'Ashok Gorre','Ashok','ashok@tworks.in',NULL,'$2b$10$G5ZVEY7cSZPOWiVpA42d0u7QJCTL9L7jTbk285FpLc5lLjriEf.oe','User','Junior Fellow',NULL,NULL,'2023-11-20 07:09:34','2023-11-20 07:09:34',NULL),(55,'Rajendra Prasad Gaddam','Rajendra','rajendra@tworks.in',NULL,'$2b$10$qrjzJP/MqJKeIV2.BmJkEeSOCuBgkp0ElggDjpgl08pFKZkAd8SG6','User','Junior Fellow',NULL,NULL,'2023-11-20 07:09:35','2023-11-20 07:09:35',NULL),(56,'Shekar Kollanolla','Shekar','k.shekar@tworks.in','+919441019793','$2b$10$u9TsKzVLtItlbBvBXBIrz.vsL2MoLtcjHVk4I/.YO0XkY3azoMm42','User','Senior Fellow',NULL,NULL,'2023-11-20 07:09:35','2023-11-20 07:09:35',NULL),(57,'Suresh Chandra Narisetty','Suresh','sureshchandra@tworks.in',NULL,'$2b$10$exuu79Jc8nrdN4YMI2yYkuR7PExXqQnGjV4FaFGW/msJyapPcgphu','User','Senior Fellow',NULL,NULL,'2023-11-20 07:09:36','2023-11-20 07:09:36',NULL),(58,'Sri Harsha Kanumalla','Harsha','sriharsha@tworks.in',NULL,'$2b$10$pCy0N0pNbVUEry1EcdqtoebMDrFxShmZQ912gOuq1hyjrFt4r7l7m','User','Fellow',NULL,NULL,'2023-11-20 07:09:37','2023-11-20 07:09:37',NULL),(59,'Sandeep Yasa','Sandeep','sandeep@tworks.in','+919985803004','$2b$10$dYSCSRzbBq.Lf0Cq/FxoeuEHE7TfLBeU2kA6KsgB1rTrPlPlIG8Ry','User','Senior Fellow',NULL,NULL,'2023-11-20 07:09:37','2023-11-20 07:09:37',NULL),(60,'Feroz Zaheer','Feroz','zaheer@tworks.in',NULL,'$2b$10$lCtDRqLXac2wj80zP8d7AOcxEuBsRpdLcSYRYMyemoIBP1dsgxE3G','User','Senior Fellow',NULL,NULL,'2023-11-20 07:09:38','2023-11-20 07:09:38',NULL),(61,'Takbir Fatima','Takbir','takbir@tworks.in',NULL,'$2b$10$aIVvJ5PQjT39VdjrExb0gubdAz/Y5n5VxHNqu8oCMQBa/Fixxby0u','User','Senior Fellow',NULL,NULL,'2023-11-20 07:09:38','2023-11-20 07:09:38',NULL),(62,'Kannoju Naveen','Naveen','naveen@tworks.in',NULL,'$2b$10$L.ef4DwWpVEKgk5plYiqBOHr8nPShthUM6uCHvUAjnS3PsCEE1kjO','User','Junior Fellow',NULL,NULL,'2023-11-20 07:09:39','2023-11-20 07:09:39',NULL),(63,'Mohd Imran','Imran','mohdimran@tworks.in',NULL,'$2b$10$HTRdxyMOfozamPV9qlcbw.VCUUqjnw74/Mba5QnpI10oFBFK69qx6','User','Intern',NULL,NULL,'2023-11-20 07:09:39','2023-11-20 07:09:39',NULL),(64,'Muniratnam Vedarsh Reddy','Vedarsh','vedarshreddy@tworks.in',NULL,'$2b$10$ExFYXc7n9ddldMAk8kWl/.Y8YZySYl9KoWa4YQp8Z9qafcbPcuWjW','User','Product Development Intern',NULL,NULL,'2023-11-20 07:09:40','2023-11-20 07:09:40',NULL),(65,'Ramasagaram Rahul Chary','Rahul Chary','rahulramasagaram@tworks.in',NULL,'$2b$10$ytW4yoK0ktMBI19J11Hcd.7TmcKQY6lg0n8tgtUL3qV7OR9hIAT5y','User','Mechanical Intern',NULL,NULL,'2023-11-20 07:09:40','2023-11-20 07:09:40',NULL),(66,'Gunda Sai Aakanksha','Sai Aakanksha','saiaakanksha@tworks.in',NULL,'$2b$10$GeCFpi6gAn33dIg4okfYkuxwn4t5JcDMTl0TaVFb5G4zrlcoW5WBe','User','Electronics Intern',NULL,NULL,'2023-11-20 07:09:41','2023-11-20 07:09:41',NULL),(67,'Aaluri Praveen Reddy','Praveen Reddy','praveen@tworks.in',NULL,'$2b$10$0FMiHdK000ZfEB18i0WOUusPSd0zwT5LDwMFNgVekb8sMMTcI/Tq2','User','Mechanical Intern',NULL,NULL,'2023-11-20 07:09:42','2023-11-20 07:09:42',NULL),(68,'Adhityan Ravichandran','Adhityan','adhityan@tworks.in',NULL,'$2b$10$iIx8ofwPlUf71v/B0VBFVeXUuGbGosXoJpO2dQQ4te0eyn0EJGnLu','User','Design Intern',NULL,NULL,'2023-11-20 07:09:42','2023-11-20 07:09:42',NULL),(69,'Abdul Wahab','Wahab','abdul.w@tworks.in',NULL,'$2b$10$TqvVTEmVhwHAQigFv1HOVOX9kuqWAJNAFmx7VXipC45z3LCM2K0wC','User','UAV Intern',NULL,NULL,'2023-11-20 07:09:43','2023-11-20 07:09:43',NULL),(70,'C. Manoj Kumar Reddy','Manoj','manoj.k@tworks.in',NULL,'$2b$10$pTiq/PbEug0PSw3AhmI5yeaXVbd9ZL4KAiZJA1gLxhqs3/pXK5npy','User','UAV Intern',NULL,NULL,'2023-11-20 07:09:43','2023-11-20 07:09:43',NULL),(71,'Barkavi S','Barkavi','barkavi@tworks.in',NULL,'$2b$10$N5buXd33Q7s8klfUqTByg.h3boxKZeiYNtGAX3sD1mvOBrHPCdEN.','User','Design intern ',NULL,NULL,'2023-11-20 07:09:44','2023-11-20 07:09:44',NULL),(72,'Potla Bharath Sai','Bharath','bharat@tworks.in',NULL,'$2b$10$bEgqPR4L3rEwLmOVQrwrduWGR73dW7iAnTPZy8ZuHx2Qa1xFPmjYi','User','Photography Intern',NULL,NULL,'2023-11-20 07:09:45','2023-11-20 07:09:45',NULL),(73,'Mir Omar Ali khan','Omar','mir@tworks.in',NULL,'$2b$10$bOAYeJHzvMY9GJ8o8xSWdOf/7pPvD939TR45nD2PyHBMcQO9mscVC','User','Woodworking Intern',NULL,NULL,'2023-11-20 07:09:45','2023-11-20 07:09:45',NULL),(74,'Sai Priyatham Sriramou','Priyatham','sai@tworks.in',NULL,'$2b$10$.YCKCiD1QpuMWaohg220cuz9kzN7UO19jHdeewmnLMqzSR/cxt3em','User','Mechanical Intern',NULL,NULL,'2023-11-20 07:09:46','2023-11-20 07:09:46',NULL),(75,'Chiruvolu Vishnu Teja','Vishnu','chiruvolu@tworks.in',NULL,'$2b$10$XgCl7mi3XoHwDOSc2qecF.ci2bBjCz4mFmhT4GiEkW3etsdxXLcSS','User','Electronics Intern',NULL,NULL,'2023-11-20 07:09:46','2023-11-20 07:09:46',NULL),(76,'Guguloth Ram Prasad Naik','Ram Prasad','prasad@tworks.in',NULL,'$2b$10$9lob4YoAMGMJyQT.zXAtqObp1N3B8EjpWiiKh1LSF/atYh3JatueK','User','Product Design Intern',NULL,NULL,'2023-11-20 07:09:47','2023-11-20 07:09:47',NULL),(77,'Pawan Teja','Pawan','pawan@tworks.in',NULL,'$2b$10$nesfakn7oaO9avj44gqJK.WssuE8Cp/cKNzOde4ZVTQ7tZ2dwuFUW','User','Electronics Intern',NULL,NULL,'2023-11-20 07:09:47','2023-11-20 07:09:47',NULL),(79,'Hiral Shah','Hiral','hiral@tworks.in',NULL,'$2b$10$HvoWK2yQ/jwRenaykg3A.ebb5kQmDV8t8dqZcFqUqIjkFnz6NlLIm','User','Apprentice',NULL,NULL,'2023-11-20 07:09:48','2023-11-20 07:09:48',NULL),(80,'Karampudi Pranav','Pranav','karampudi@tworks.in',NULL,'$2b$10$ZgqKSGRggzKcmXyvSag9AO.oLxfDA53uNJtYklp4TGNgrMzL6wstC','User','Mechanical Intern',NULL,NULL,'2023-11-20 07:09:49','2023-11-20 07:09:49',NULL),(81,'Nidhi Jain','Nidhi','nidhi@tworks.in',NULL,'$2b$10$6HlrRwrEeAOJW/7KP1hpZ.IWjTOcvLVb9wBSX5.b.8KFVfYYxUlnu','User','UAV Intern',NULL,NULL,'2023-11-20 07:09:50','2023-11-20 07:09:50',NULL),(82,'Vedala Radha Soundarya Sundar Ananth','Vedala Radha','vedala@tworks.in',NULL,'$2b$10$AToA1mrqKtaQhW8ria9GcOnYthmpz2rFrpAUtd9iSxDaNP8dgGs76','User','Electronics Intern',NULL,NULL,'2023-11-20 07:09:50','2023-11-20 07:09:50',NULL),(83,'S Karthikraj','Karthikraj','karthik@tworks.in',NULL,'$2b$10$9tTGE0aROoORcDy9TrtvMuCynVnfVEbE3ASno46stmkvNdxeo2dii','User','Electronics Intern',NULL,NULL,'2023-11-20 07:09:51','2023-11-20 07:09:51',NULL),(84,'Korandla Laasyasri','Korandla','korandla@tworks.in',NULL,'$2b$10$she3TpQmRkPGs1i9No579uN9PSW0bZwma/kWFqF9xwk87qZ9KDOwe','User','Operations Intern',NULL,NULL,'2023-11-20 07:09:51','2023-11-20 07:09:51',NULL),(95,'Tahmina Fatima','Tahmina ','tahmina@tworks.in','+919160264263','$2b$10$cYTKBS7czN1HlNMPNK114.6/SeBsKWNX1ls1ImytyhXJ9d.kKe9gO','User','Intern',NULL,'2023-11-27 11:09:44','2023-11-27 11:09:36','2023-11-27 11:10:28',NULL),(97,'Suhail Ali','Suhail','suhail@tworks.in',NULL,'$2b$10$oFeRyOB9tI.GERbOgUaBJuxChTsOxhesWSTWd6PRrIXdhzjoGVZwm','User','Intern',NULL,'2023-12-03 19:44:40','2023-12-03 18:44:05','2023-12-03 19:44:40','046376');
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

-- Dump completed on 2023-12-04  2:30:19
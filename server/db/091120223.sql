-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: tworksdb
-- ------------------------------------------------------
-- Server version       8.0.35-0ubuntu0.22.04.1

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
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `phone_2` (`phone`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `phone_3` (`phone`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `phone_4` (`phone`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `phone_5` (`phone`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `phone_6` (`phone`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `phone_7` (`phone`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `phone_8` (`phone`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `phone_9` (`phone`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `phone_10` (`phone`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `phone_11` (`phone`)
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
  `status` enum('NOT STARTED','ON HOLD','OVERDUE','IN PROGRESS','COMPLETED','CANCELED') DEFAULT NULL,
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
INSERT INTO `legacys` VALUES (1,'Zund press release','','Firoz','Varun','','NA','COMPLETED','',NULL,'2023-11-08 16:16:38','2023-11-08 16:16:38'),(2,'Community Hackathon','Conduct a hackathon/make-a-thon in June/July for 1-2 days for external participants. They will not stay in the premises though.','Firoz','Darshan','2023-09-17','HIGH','IN PROGRESS','2023-08-09',NULL,'2023-11-08 16:16:38','2023-11-08 16:16:38'),(3,'RIDP','Futher secondary research for finalising RIDP program','Firoz','KPMG','2023-08-17','HIGH','IN PROGRESS','2023-08-17',NULL,'2023-11-08 16:16:39','2023-11-08 16:16:39'),(4,'Hike letters','Issuing of hike letters to employees','Veera','Likitha','2023-08-17','HIGH','COMPLETED','',NULL,'2023-11-08 16:16:39','2023-11-08 16:16:39'),(5,'good vs bad design','','Veera','TJ','2023-08-11','HIGH','COMPLETED','',NULL,'2023-11-08 16:16:40','2023-11-08 16:16:40'),(6,'Posters - Come fail, Learn & Build ','Wall graphics','Veera','Swetha','2023-08-15','MEDIUM','COMPLETED','2023-08-10',NULL,'2023-11-08 16:16:40','2023-11-08 16:16:40'),(7,'AI workshops','Workshop on all tools available for AI','Veera','TJ','2023-08-09','NA','COMPLETED','',NULL,'2023-11-08 16:16:41','2023-11-08 16:16:41'),(8,'Equipment  competition','Extended Zund challenge to all major equipment','Firoz','Varun','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:16:41','2023-11-08 16:16:41'),(9,'EA to CEO hire','Need to hire a EA to CEO','Anand','Anand','2023-07-28','HIGH','IN PROGRESS','2023-08-10',NULL,'2023-11-08 16:16:42','2023-11-08 16:16:42'),(10,'Internship completion letters ','Give internship completion letter to interns','Veera','Likitha','2023-08-05','MEDIUM','COMPLETED','',NULL,'2023-11-08 16:16:43','2023-11-08 16:16:43'),(11,'Minister -response to funds letter','Letter authorising VCMD from PS and minister','Raj','Mythilli','','HIGH','COMPLETED','2023-08-09',NULL,'2023-11-08 16:16:43','2023-11-08 16:16:43'),(12,'Exclusive T-Merch','Free, limited edition for staff only, generic merch for visitors/sale. Opening up a Merch vertical - Getting people to design objects + aligning in the same direction','Sanjay','Yoshita','','HIGH','NOT STARTED','2023-08-13',NULL,'2023-11-08 16:16:44','2023-11-08 16:16:44'),(13,'ERP Next','ERP implementation in the organisation','Firoz','Varun','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:16:44','2023-11-08 16:16:44'),(14,'Mementos (personalised, generic)','They make, we make. Mementos for guests and visitors at T-Works. Some can be personalised for important people.','Sanjay','Nehal','','HIGH','ON HOLD','',NULL,'2023-11-08 16:16:45','2023-11-08 16:16:45'),(15,'Sensor Lab','100 Cr procurement (Sensors + Actuators)','Sanjay','Madhav','','HIGH','ON HOLD','',NULL,'2023-11-08 16:16:45','2023-11-08 16:16:45'),(16,'Vertical stacking furniture for residents','Micro studios for the users renting the space - now would be a part of phase 1.5','Sanjay','Yoshita','','HIGH','ON HOLD','',NULL,'2023-11-08 16:16:46','2023-11-08 16:16:46'),(17,'Software interns','','Veera','Likitha','','MEDIUM','COMPLETED','',NULL,'2023-11-08 16:16:46','2023-11-08 16:16:46'),(18,'Interim hike letters','To handover','Veera','Likitha','','HIGH','COMPLETED','',NULL,'2023-11-08 16:16:47','2023-11-08 16:16:47'),(19,'Designation changes to reflect','To handover','Veera','Likitha','','HIGH','COMPLETED','',NULL,'2023-11-08 16:16:47','2023-11-08 16:16:47'),(20,'ERP Vendor visit','ERP Vendor visit','Firoz','Varun','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:16:48','2023-11-08 16:16:48'),(21,'The Byte Bending Championship - T-Works Embedded Challenge','Held a two day challenge for participants ','Firoz','Darshan','2023-09-17','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:16:48','2023-11-08 16:16:48'),(22,'Org Structure','If the current reporting structure is entered into the ERP HR database, the org structure is created automatically. Please do this today.','Veera','Likitha','2023-07-24','HIGH','COMPLETED','',NULL,'2023-11-08 16:16:49','2023-11-08 16:16:49'),(23,'Workshops','Curriculum, Materials, Pipeline of trainers for conducting workshops/trainings','Veera','TJ','','HIGH','COMPLETED','',NULL,'2023-11-08 16:16:49','2023-11-08 16:16:49'),(24,'Lockheed Martin, Boeing introductions','Work with US consulate (Salil) for introductions for LM and Boeing','Veera','Anand','2023-08-22','HIGH','IN PROGRESS','2023-08-22',NULL,'2023-11-08 16:16:50','2023-11-08 16:16:50'),(25,'T-Works lettering in atrium','','Sanjay','Yoshita','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:16:50','2023-11-08 16:16:50'),(26,'72 hr challenge #2','Plan a second 72 hr challenge in August 2023','Firoz','Sharat','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:16:51','2023-11-08 16:16:51'),(27,'Grainpro','FTO study, prototype','Firoz','Firoz','2023-09-15','HIGH','NOT STARTED','2023-08-13',NULL,'2023-11-08 16:16:51','2023-11-08 16:16:51'),(28,'Drone racing','','Firoz','Captain MFH','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:16:52','2023-11-08 16:16:52'),(29,'Blogs, newsletters','release the edition every month through an emailer','Veera','ZF','','HIGH','IN PROGRESS','2023-08-08',NULL,'2023-11-08 16:16:52','2023-11-08 16:16:52'),(30,'Everyone should conduct a workshop atleast once','','Veera','TJ','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:16:53','2023-11-08 16:16:53'),(31,'go full throttle  on ceramics workship','','Veera','TJ','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:16:53','2023-11-08 16:16:53'),(32,'School kits (Maker Box)',' Maker box is a kit for school kids designed to stimulate thinking by providing access to a carefully curated selection of materials, technologies, and educational resources.','Sanjay','Akanksha','2023-09-30','MEDIUM','IN PROGRESS','2023-08-19',NULL,'2023-11-08 16:16:54','2023-11-08 16:16:54'),(33,'Funding (Opex) letter to Minister','Get letter reviewed and sent','Raj','Raj','2023-06-27','NA','COMPLETED','',NULL,'2023-11-08 16:16:54','2023-11-08 16:16:54'),(34,'battle bots','','Firoz','Captain MFH','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:16:55','2023-11-08 16:16:55'),(35,'Zund Challenge','Challenge the internal team to make something on the Zund through a competition','Sanjay','Shuja','2023-08-23','MEDIUM','COMPLETED','2023-08-23',NULL,'2023-11-08 16:16:55','2023-11-08 16:16:55'),(36,'Fundraising (Capex)','Continue raising remaining 20 Cr from industry (Amara Raja, Tejas Networks, Greenko)','Anand','Sharat','2023-08-09','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:16:56','2023-11-08 16:16:56'),(37,'Sujai review finances','Outflow, income, granular and macro','Raj','Raj','','MEDIUM','ON HOLD','',NULL,'2023-11-08 16:16:56','2023-11-08 16:16:56'),(38,'Change switches','Look, alignment','Meera','Meera','2023-07-31','MEDIUM','ON HOLD','2023-09-01',NULL,'2023-11-08 16:16:57','2023-11-08 16:16:57'),(39,'Rewards and Recognition','Need to roll out R&R. Don’t need a comprehensive total rewards policy, only a couple of initiatives to start with. Something like a spot award and a quarterly award.','Veera','Likitha','2023-08-25','HIGH','ON HOLD','',NULL,'2023-11-08 16:16:57','2023-11-08 16:16:57'),(40,'Chief Secretary invitation','Letter inviting CS to T-Works and T-Fiber NoC','Anand','Anand','2023-07-21','NA','COMPLETED','',NULL,'2023-11-08 16:16:58','2023-11-08 16:16:58'),(41,'NDA for T-Works staff ','To protect the interests of external parties engaging with us.','Veera','Likitha','2023-08-17','HIGH','COMPLETED','',NULL,'2023-11-08 16:16:58','2023-11-08 16:16:58'),(42,'Apprenticeship for shops','','Firoz','Firoz / Varun','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:16:59','2023-11-08 16:16:59'),(43,'Library books','Funding, listing, procurement','Anand','KPMG','2023-04-17','NA','ON HOLD','',NULL,'2023-11-08 16:16:59','2023-11-08 16:16:59'),(44,'Phone chargers in the board room','Board room, conf room, someplace in the lobby, powerbanks on rent','Meera','Meera','2023-07-22','NA','COMPLETED','',NULL,'2023-11-08 16:17:00','2023-11-08 16:17:00'),(45,'setup textile equipment','','Firoz','Varun','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:00','2023-11-08 16:17:00'),(46,'Chaiminar','A 72 hr challenge event to design and make a Irani chai making machine. Complete it for regular use','Sanjay','Firoz','2023-08-30','MEDIUM','NOT STARTED','2023-08-15',NULL,'2023-11-08 16:17:01','2023-11-08 16:17:01'),(47,'Friday Feature','time slot for internal team debates. Open to any topic related to T-Works and what we do.','Veera','TJ','2023-08-25','MEDIUM','NOT STARTED','',NULL,'2023-11-08 16:17:01','2023-11-08 16:17:01'),(48,'Safety officer requirement','Reaching out to the safety institutes, sending proposal, negotiations','Veera','Likitha','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:02','2023-11-08 16:17:02'),(49,'Agreements and legal','MOU\'s, NDA\'s and User agreement','Raj','Mythilli','2023-07-31','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:03','2023-11-08 16:17:03'),(50,'Requesting mail access to Koundinya','*Mail access to Koundinya (Gmail)','Raj','Mythilli','2023-08-22','HIGH','COMPLETED','',NULL,'2023-11-08 16:17:03','2023-11-08 16:17:03'),(51,'ICE gate','Customs clearance','Raj','Syed','2023-07-28','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:04','2023-11-08 16:17:04'),(52,'SIRO Customs duty exemption process','Research about SIRO Customs duty, does it need more ?','Anand','Syed','2023-08-11','HIGH','COMPLETED','',NULL,'2023-11-08 16:17:04','2023-11-08 16:17:04'),(53,'PCB Fab setup','Setting up of the PCB fab sponsered by Qualcomm','Firoz','Varun','','HIGH','ON HOLD','',NULL,'2023-11-08 16:17:05','2023-11-08 16:17:05'),(54,'Phase 1 do up','Cleaning related to internal plantation','Meera','Meera','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:05','2023-11-08 16:17:05'),(55,'Note file, templates for procurement','Deviation for procurement policy, single vendor, service','Raj','Mythilli','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:06','2023-11-08 16:17:06'),(56,'Projects with interns in other departments - Budget for consumable Electronic parts','Based on projections stocking of commonly used electronic parts across multiple disciplines','Sanjay','Madhav','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:06','2023-11-08 16:17:06'),(57,'Rate card','Review and sign-off on rate cards for rentals and proto services','Firoz','Firoz','2023-08-25','HIGH','ON HOLD','2023-08-11',NULL,'2023-11-08 16:17:07','2023-11-08 16:17:07'),(58,'Silver filigree','Designing and manufacturing machines to automate building blocks of filigree art form','Sanjay','Sharat','2023-09-25','HIGH','OVERDUE','',NULL,'2023-11-08 16:17:07','2023-11-08 16:17:07'),(59,'Dashcam','Enclosure design and low volume (12 units) prototyping','Sanjay','Sharat','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:08','2023-11-08 16:17:08'),(60,'Drone in a box','Product design and manufacturing of a drone-in-a-box platform','Sanjay','Sharat','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:08','2023-11-08 16:17:08'),(61,'Stewart platform','6-dof motion platform as a development kit','Sanjay','Sharat','','LOW','ON HOLD','',NULL,'2023-11-08 16:17:09','2023-11-08 16:17:09'),(62,'Smartbox','Asset tracking system that sends alerts when the box is opened; used for tracking sensitive question papers','Sanjay','Sharat','','LOW','IN PROGRESS','',NULL,'2023-11-08 16:17:09','2023-11-08 16:17:09'),(63,'Sprints - 2 axis delta PnP','a pick and place machine using vaccum ','Sanjay',' Siva','2023-08-30','LOW','IN PROGRESS','',NULL,'2023-11-08 16:17:10','2023-11-08 16:17:10'),(64,'Sprints - Desktop mill','make an enlosure, finalise the electronics and make it functioning','Sanjay',' Nirmit','2023-08-21','LOW','IN PROGRESS','',NULL,'2023-11-08 16:17:10','2023-11-08 16:17:10'),(65,'Sprints - Segway','Self balancing vehicle','Sanjay',' Absar','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:11','2023-11-08 16:17:11'),(66,'Sprints - Weld positioner','Jig for cicular objects','Sanjay','Yashwanth','2023-08-31','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:11','2023-11-08 16:17:11'),(67,'Reach out to academic institutions for engineering and management internships','Out of telangana search for interns','Veera','Likitha','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:12','2023-11-08 16:17:12'),(68,'Assimilation plan','One week get-to-know the company plan. Need a document highlighting what we can do in one week.','Veera','Likitha','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:12','2023-11-08 16:17:12'),(69,'ERP corrections','Trying to correct all the employee ID\'s','Veera','Likitha','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:13','2023-11-08 16:17:13'),(70,'Graphic design interns','Reach out to colleges','Veera','Likitha','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:13','2023-11-08 16:17:13'),(71,'Software experience people','','Veera','Likitha','','MEDIUM','COMPLETED','',NULL,'2023-11-08 16:17:14','2023-11-08 16:17:14'),(72,'Build Web Page to capture Interview Feedbacks','','Veera','Likitha','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:14','2023-11-08 16:17:14'),(73,'LoFi - Workshop','to host a workshop for external','Veera','TJ','2023-09-28','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:15','2023-11-08 16:17:15'),(74,'World Skills','How can T-Works contribute/participate','Veera','Veera','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:15','2023-11-08 16:17:15'),(75,'Residency','','Veera','Veera','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:16','2023-11-08 16:17:16'),(76,'Carpenter upskilling','','Veera','TJ','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:16','2023-11-08 16:17:16'),(77,'Media interviews','Arijit Burman ET','Veera','Veera','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:17','2023-11-08 16:17:17'),(78,'sketching course for internal team','Sketching 101 for internal product team especially for mech folks','Veera','TJ','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:17','2023-11-08 16:17:17'),(79,'Training needs and identification','Gathering internal training requirements and finding suitable institutions and facilitated to the employess','Veera','Likitha','','MEDIUM','NOT STARTED','',NULL,'2023-11-08 16:17:18','2023-11-08 16:17:18'),(80,'New Joinee PPT on Friday','Each Friday, along with usual activities (T-Debate etc), we can have a 5-10 min ppt by new joinees about what they do.','Veera','Likitha','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:18','2023-11-08 16:17:18'),(81,'Employee handbook','We need an Employee Handbook for existing and new employees/interns to establish rules/guidelines/tips etc to accelerate the induction process.  ','Veera','ZF','','LOW','NOT STARTED','',NULL,'2023-11-08 16:17:19','2023-11-08 16:17:19'),(82,'Phase 1.5 conceptual art','setting a design direction for phase 1.5','Sanjay','Yoshita','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:19','2023-11-08 16:17:19'),(83,'Team office design','designing work benches and other supporting objects in the space','Sanjay','Yoshita','','LOW','IN PROGRESS','',NULL,'2023-11-08 16:17:20','2023-11-08 16:17:20'),(84,'Product Exhibition redesign','alternate design to the current product display','Sanjay','Yoshita','','MEDIUM','ON HOLD','',NULL,'2023-11-08 16:17:20','2023-11-08 16:17:20'),(85,'Zund storage system','a creative storage for the ARP made on the Zund','Sanjay','Yoshita','2023-09-29','LOW','IN PROGRESS','',NULL,'2023-11-08 16:17:21','2023-11-08 16:17:21'),(86,'Kinetic art installation','designing the event including community and in house staff','Sanjay','Yoshita','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:21','2023-11-08 16:17:21'),(87,'Sujai inaugural speech clips','','Veera','ZF','','HIGH','ON HOLD','',NULL,'2023-11-08 16:17:22','2023-11-08 16:17:22'),(88,'Improved Cookstove (ICS)','Design of an ICS with specific focus on design elements that makes the product user-friendly, efficient, and enviornmentally sustainable.','Sanjay','Simran','2023-09-30','MEDIUM','ON HOLD','',NULL,'2023-11-08 16:17:22','2023-11-08 16:17:22'),(89,'Atom ZLT Disaster Relief Kit (DRK)','Design of a kit that includes upto 32 essential items related to shelter, food, and sanitation that a family of 4 would need in a relief camp in the event of immediate displacement ffrom their home due to natural disasters and/or war.  ','Sanjay','Simran','2023-09-25','MEDIUM','ON HOLD','',NULL,'2023-11-08 16:17:23','2023-11-08 16:17:23'),(90,'Deloitte Scrolling White Board','Deloitte University requires a novel scrolling whiteboard design that can fit onto pillars in their training rooms. ','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-08 16:17:24','2023-11-08 16:17:24'),(91,'Trismus Rehab Device ','The device is used to rehab patients suffering from trismus. The client has a novel idea of adding a force sensor to allow patients to measure their progress in being able to re-open their jaw. ','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-08 16:17:24','2023-11-08 16:17:24'),(92,'UPS Industrial Design','client makes UPS and Inverters and would like help in the Industrial Redesign and addition of some features. ','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-08 16:17:25','2023-11-08 16:17:25'),(93,'Artificial Heart Design Improvements','client is making a novel permanent artificial heart design. Currently they have a PoC and are looking to improve their mechanical design to meet functional requirements','Sanjay','Simran','','MEDIUM','NOT STARTED','',NULL,'2023-11-08 16:17:25','2023-11-08 16:17:25'),(94,'Deloitte Installation Repairs','There are two repairs to the DU Interaction Center which we are taking up:  1. William Deloitte Statue Hand Replacemement 2. Spinnign Wheel Redesign','Sanjay','Simran','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:26','2023-11-08 16:17:26'),(95,'CCMB Silicone Projects','There are two minor design projects from CCMB: 1. Silicone Tube for NeoNatal Care Machine Redesign and Moulding 2. Silicone Sleeve for C-Section Tool','Sanjay','Simran','','LOW','NOT STARTED','',NULL,'2023-11-08 16:17:26','2023-11-08 16:17:26'),(96,'Vacuum Chamber Usage for Bamboo Fiber Imfusion','client is looking to use the vacuum chamber at T-Works but requires a custom steel vessel. They are fabricating it but will need to do custom silicone sleeve design and some metal shop work.   ','Sanjay','Simran','','LOW','IN PROGRESS','',NULL,'2023-11-08 16:17:27','2023-11-08 16:17:27'),(97,'Flexible Materials Moulding ','Want to establish a flexible materials moulding lab to provide silicone and PU rubber moulding as an internal and external capability. ','Sanjay','Simran','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:27','2023-11-08 16:17:27'),(98,'SLA Printing Guideline','Need a handbook for training users on how to use the SLA printer. ','Firoz','Simran/Nitin','','MEDIUM','NOT STARTED','',NULL,'2023-11-08 16:17:28','2023-11-08 16:17:28'),(99,'MSME IPFC Application','Application to MSME IPR facilitation cell','Raj','Raj','2023-08-11','HIGH','ON HOLD','',NULL,'2023-11-08 16:17:28','2023-11-08 16:17:28'),(100,'Poster - POSH','Putting POSH  posters in the facility','Veera','Likitha','','HIGH','ON HOLD','',NULL,'2023-11-08 16:17:29','2023-11-08 16:17:29'),(101,'Business modelling','Prepare a holistic business model with P&L projections','Veera','TJ','','HIGH','ON HOLD','',NULL,'2023-11-08 16:17:29','2023-11-08 16:17:29'),(102,'Seed dropping pay load','Design and develop a seed ball dispensing drone payload','Sanjay','Shuja','2023-09-09','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:30','2023-11-08 16:17:30'),(103,'Saral web - Sclear','POS style attendance system for muncipality workers','Sanjay','Firoz','2023-09-06','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:30','2023-11-08 16:17:30'),(104,'Proto services','Services team to support inbound quiries','Firoz','Firoz','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:31','2023-11-08 16:17:31'),(105,'Liability/warranty agreements','For external users to use the space and equipment','Raj','Mythilli/Tejaswini','2023-07-31','HIGH','COMPLETED','',NULL,'2023-11-08 16:17:31','2023-11-08 16:17:31'),(106,'Achievements for FY 22-23','Solutions seekers and partnerships acheivements','Raj','Sreya/Anurag','2023-07-29','HIGH','COMPLETED','',NULL,'2023-11-08 16:17:32','2023-11-08 16:17:32'),(107,'Sports.tworks','Internal sports activities. 6-a-side football, carrom, TT, basketball etc. Facilitate entry into inter-corporate tournaments in Hyd.','Veera','Likitha','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:32','2023-11-08 16:17:32'),(108,'AIG Hospitals TNS box','The product is used to train doctors on how to perform a pituitary tumor resection through an endoscopic transsphenoidal approach.','Sanjay','Simran','','LOW','COMPLETED','',NULL,'2023-11-08 16:17:33','2023-11-08 16:17:33'),(109,'Board review PPT ','Update on the agenda items for board meeting on 3rd Aug','Anand','KPMG','2023-08-03','HIGH','COMPLETED','',NULL,'2023-11-08 16:17:33','2023-11-08 16:17:33'),(110,'Souvenir design','designing  a souvenier that can be given to t-works guests','Sanjay','Yoshita','2023-08-25','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:34','2023-11-08 16:17:34'),(111,'CNC Circulation monitoring system','Accessory for HAAS','Sanjay','Madhav','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:34','2023-11-08 16:17:34'),(112,'Neo natal suction system','medical device for endotrechial suctioning process','Sanjay','Darshan','2023-08-19','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:35','2023-11-08 16:17:35'),(113,'Temperature caliberation system','temperature sensors and machining electronics needs to be validated with a wide range of temperature settings, this unit provides programmable temperatures','Sanjay','Suhas','','MEDIUM','IN PROGRESS','',NULL,'2023-11-08 16:17:35','2023-11-08 16:17:35'),(114,'CRIDA - Rover','Agricultural BOT, Navigate through farrow in raised bed farming','Sanjay','Madhav','','LOW','ON HOLD','',NULL,'2023-11-08 16:17:36','2023-11-08 16:17:36'),(115,'Chemo drug delivery system','bed side remote drug delivery system','Sanjay','Madhav','','LOW','ON HOLD','',NULL,'2023-11-08 16:17:36','2023-11-08 16:17:36'),(116,'Funding (CAPEX) - Rs.29 Cr','To get Funds from State Finance/Budget Section','Raj','Raj','2023-09-10','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:37','2023-11-08 16:17:37'),(117,'Entry and Exit gate Signages','Way finding signages at entry and exit gates','Meera','Meera','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:37','2023-11-08 16:17:37'),(118,'Vendor machine installation','Installation of vendor machine in T-Works facility','Meera','Padmini','2023-08-22','HIGH','COMPLETED','',NULL,'2023-11-08 16:17:38','2023-11-08 16:17:38'),(119,'Chaiminar movie','We hve a 34min movie on chaiminar. Have to break it up into 5 min clips with appropriate captions, titles etc.','Veera','ZF','','HIGH','NOT STARTED','',NULL,'2023-11-08 16:17:38','2023-11-08 16:17:38'),(120,'Project Management Portal','Make a in house portal which clearly defines team members on what their priority is, gives an idea about the workload to the management and where to hire people','Anand','Koundinya/Rahman','','HIGH','IN PROGRESS','',NULL,'2023-11-08 16:17:39','2023-11-08 16:17:39'),(121,'Remuneration structure review','','Veera','Veera','','NA','COMPLETED','',NULL,'2023-11-08 16:17:39','2023-11-08 16:17:39'),(122,'Product team mission','Articulate what we mean by prototype, what it is not etc','Sanjay','Sanjay','','NA','ON HOLD','',NULL,'2023-11-08 16:17:40','2023-11-08 16:17:40'),(123,'Logo design (T-Works logo) competition','','Sanjay','Swetha','','NA','ON HOLD','',NULL,'2023-11-08 16:17:40','2023-11-08 16:17:40'),(124,'VIP washroom','EAST side second floor washroom to be converted to VIP washroom','Meera','Meera','','NA','ON HOLD','',NULL,'2023-11-08 16:17:41','2023-11-08 16:17:41'),(125,'Structure over building','Conflict with phase 3? Art installations, internal artwork','Sanjay','Yoshita','','NA','ON HOLD','',NULL,'2023-11-08 16:17:41','2023-11-08 16:17:41'),(126,'Mat under urinal','Have to discuss','Meera','Meera','','NA','ON HOLD','',NULL,'2023-11-08 16:17:42','2023-11-08 16:17:42'),(127,'External lighting','Landscaping and roof lighting','Meera','Meera','','NA','ON HOLD','',NULL,'2023-11-08 16:17:42','2023-11-08 16:17:42'),(128,'Star ratings for external consultants, ecosystem partner vendors','','Firoz','Veera/Anurag','','NA','NOT STARTED','',NULL,'2023-11-08 16:17:43','2023-11-08 16:17:43'),(129,'Aeroplane structure in atrium','','Firoz','Varun','','NA','ON HOLD','',NULL,'2023-11-08 16:17:43','2023-11-08 16:17:43'),(130,'Phase 1.5/2','Requirements, design, construction','Firoz','Varun/Meera','','NA','ON HOLD','',NULL,'2023-11-08 16:17:44','2023-11-08 16:17:44'),(131,'Ai Tour Guide','Industrial Design for AI Tour Guide, a handheld device that will guide visitors to go around T-Works.','Sanjay','Akanksha','2023-08-28','NA','IN PROGRESS','',NULL,'2023-11-08 16:17:45','2023-11-08 16:17:45'),(132,'Milk analyser','TFIR based milk analyser - building a benchtop POC in collab with their team','Sanjay','Sharat','','NA','IN PROGRESS','',NULL,'2023-11-08 16:17:45','2023-11-08 16:17:45'),(133,'T-Works University','','Veera','TJ','','NA','ON HOLD','',NULL,'2023-11-08 16:17:46','2023-11-08 16:17:46'),(134,'Creating an external services roster of designers, engineers, fabricators etc','','Sanjay','Sanjay','','NA','COMPLETED','',NULL,'2023-11-08 16:17:46','2023-11-08 16:17:46');
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
  CONSTRAINT `messages_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_22` FOREIGN KEY (`channelId`) REFERENCES `channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `status` enum('NOT STARTED','ON HOLD','OVERDUE','IN PROGRESS','COMPLETED','CANCELED') DEFAULT NULL,
  `nextReview` varchar(255) DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Suhail Project','','Anand','Suhail','2023-11-10','HIGH','NOT STARTED','2023-11-18',2,'2023-11-09 06:40:22','2023-11-09 06:40:22'),(2,'Suhail Projectssss','','Meera','Madhav','2023-11-10','MEDIUM','COMPLETED','2023-11-17',2,'2023-11-09 06:41:39','2023-11-09 06:41:39');
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
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Lead','Owner','User') DEFAULT 'User',
  `title` text,
  `profileImage` varchar(255) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `phone_2` (`phone`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `phone_3` (`phone`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `phone_4` (`phone`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `phone_5` (`phone`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `phone_6` (`phone`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `phone_7` (`phone`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `phone_8` (`phone`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `phone_9` (`phone`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `phone_10` (`phone`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `phone_11` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','T-WORKS','Admin T-WORKS','admin@tworks.in',NULL,'$2b$10$z0Fkf1pvzh0cwmHbTQ4R4uCs9Jad.BAYTYPwZ3LRG6dGPlj.4y3dm','Admin','Administrator',NULL,'2023-11-09 05:59:34','2023-11-08 16:17:57','2023-11-09 05:59:34'),(2,'Anand','Rajagaopalan','Anand Rajagaopalan','anand@tworks.in','+919849365735','$2b$10$g45caCHbADkrQFYKANJHKO1.qomZCWEiRVb3T/586hoYxnRWHsDRe','Lead','Vice President, Operations',NULL,'2023-11-09 07:03:26','2023-11-08 16:17:58','2023-11-09 07:03:26'),(3,'Sanjay Kumar','Gajjala','Sanjay Gajjala','sanjay@tworks.in','+919989926313','$2b$10$vvI6f6TU4/AacXem0kULZO0kErdWGNozhJBMEiPmxWfckcYdFKHPe','Lead','Sr.Director - Product Engineering',NULL,NULL,'2023-11-08 16:17:58','2023-11-08 16:17:58'),(4,'Varun','Sivaram','Varun Sivaram','varun@tworks.in',NULL,'$2b$10$G.DPXljuspobcP6wWbp0OOMvFD8JGdyriMyUH252HsVWHPon5A3KO','User','Architect - Prototype Infrastructure',NULL,NULL,'2023-11-08 16:17:59','2023-11-08 16:17:59'),(5,'Firoz','Ahammad','Firoz Ahammad','firoz@tworks.in','+919700169649','$2b$10$/3pOtt/hX8alX0q.qg5s3eBrgI/Imh0P6m3yZXjFb2VsbAX1WIcE6','Lead','Director- Technical',NULL,NULL,'2023-11-08 16:17:59','2023-11-09 05:48:56'),(6,'Sharat Chander','Reddy','Sharat Chander Reddy','sharat@tworks.in',NULL,'$2b$10$K4/AnXUqh2b0H5bhZ3oxk.QoRfPGBPPlIOCNS7lt1V67Em6jiuME2','User','Senior Product Manager',NULL,NULL,'2023-11-08 16:18:00','2023-11-08 16:18:00'),(7,'Simran Singh','Wasu','Simran Singh Wasu','simran@tworks.in',NULL,'$2b$10$0bCLTsdDAk11vXMaOWcB8OGhVQ667XFeEn08sPLw0nRUSUN66aZaa','User','Product Manager',NULL,NULL,'2023-11-08 16:18:01','2023-11-08 16:18:01'),(8,'Abdur','Rahman S','Abdur Rahman S','rahman@tworks.in',NULL,'$2b$10$v6taQWm2ugDucEOeT6qsfukI.YOpXOVDD7yBpAr4QFrzdVTeOJMdq','User','Lead Software Engineer',NULL,NULL,'2023-11-08 16:18:01','2023-11-08 16:18:01'),(9,'Madhav','Tennati','Madhav Tennati','madhav@tworks.in',NULL,'$2b$10$wJDC3/yiEjti/k0YcNQ8yeZxlwovSLVAyDAJUVM0S4NWwY/fDOpuO','User','Chief Product Architect',NULL,NULL,'2023-11-08 16:18:02','2023-11-08 16:18:02'),(10,'Niharika','Dama','Niharika Dama','niharika@tworks.in',NULL,'$2b$10$FkoBcatufRp..I0rOQIFX.TspryAOKQ8aStthRSpmGRoRiUZzDPR6','User','Senior Executive -Finance & Accounting',NULL,NULL,'2023-11-08 16:18:02','2023-11-08 16:18:02'),(11,'Sheik','Khadeer','Sheik Khadeer','Khadeer@tworks.in',NULL,'$2b$10$E4sBIhXRpcfLuZ778lPdqOlDCjjwKO3X.XqT5jjtNn3VvMeWe.FJC','User','Senior Engineer - Mechanical',NULL,NULL,'2023-11-08 16:18:03','2023-11-08 16:18:03'),(12,'Syed','Shanawaz','Syed Shanawaz','syed@tworks.in',NULL,'$2b$10$LfX7ckq6X7.MqqY/10Y7Z.UG6yDODesN7nA2YTrQyENRH/oDxWlj6','User','Assistant Manager - Procurement',NULL,NULL,'2023-11-08 16:18:03','2023-11-08 16:18:03'),(13,'Likhitha','Maashetty','Likhitha Maashetty','likhitha@tworks.in',NULL,'$2b$10$C2HhmNl13rFH91SIzhVspuNLwh/PS7ziT/O8V9aM8Fm831zSCqw.a','User','Senior Executive- Human Resources',NULL,NULL,'2023-11-08 16:18:04','2023-11-08 16:18:04'),(14,'Anirudh','Koteshwaran','Anirudh Koteshwaran','Anirudh@tworks.in',NULL,'$2b$10$4vjP7l2zotKh2qbF8O97IeWh.aNpHJk7JDleJ0OsJ3Rbw4zSJzY3G','User','Furniture & Spatial Designer',NULL,NULL,'2023-11-08 16:18:05','2023-11-08 16:18:05'),(15,'Absar','Ul Haq Syed','Absar Ul Haq Syed ','absar@tworks.in',NULL,'$2b$10$atJrp..HIW0Fn7DKhEroXugpY8rBlf61OgFdv9DqFWA/ntL65oAvi','User','Prototyping Design Engineer',NULL,NULL,'2023-11-08 16:18:05','2023-11-08 16:18:05'),(16,'Raj','Shekhar','Raj Shekhar Vadlamani','rajshekhar@tworks.in','+919849994650','$2b$10$A4R4V8gVEBJ83RgsRuERmeI0m8EOekkGqRorc.NR7DKIAPJdAMGXK','Lead','Finance Controller - Finance & Accounting',NULL,NULL,'2023-11-08 16:18:06','2023-11-09 05:49:26'),(17,'Mohammed Talha',' Adil','Mohammed Talha Adil','adil@tworks.in',NULL,'$2b$10$iEZOUrroptbAsX1nQ4smgeQa4iJ9Ow4WerZ44WufuS5j6kIocNUi6','User','Lead Prototyping Engineer',NULL,NULL,'2023-11-08 16:18:06','2023-11-08 16:18:06'),(18,'Lakshman','Batthula','Lakshman Batthula','lakshman@tworks.in',NULL,'$2b$10$Z1W003E/yQV2f6t7wYvVwO6RlfA5.LLVdPzbCYxrK7dWLky71Vk12','User','PCB Layout Design Engineer',NULL,NULL,'2023-11-08 16:18:07','2023-11-08 16:18:07'),(19,'Anurag','Velury','Anurag Velury','anurag@tworks.in',NULL,'$2b$10$asAycOSe5Nc0O4Tf336xau641E3MJjBaL47I9fZwlhhOmILSDQVja','User','Lead - Growth & Partnerships',NULL,NULL,'2023-11-08 16:18:08','2023-11-08 16:18:08'),(20,'Tejaswini','Kidambi','Tejaswini Kidambi','tejaswini@tworks.in',NULL,'$2b$10$HnJKoxURktC0PaDr8QS/D.mOBdyLPAic7b8QHocVCititNaQqg1tS','User','Business Development Manager',NULL,NULL,'2023-11-08 16:18:08','2023-11-08 16:18:08'),(21,'Santhosh','Koppu','Santhosh Koppu','santhosh@tworks.in',NULL,'$2b$10$EwsJc6VKdgfJ2ysH.GTKiehMVsOlejQiAA/PYBEie77emGbfipMD2','User','Senior Engineer - Facility Maintainance Engineer',NULL,NULL,'2023-11-08 16:18:09','2023-11-08 16:18:09'),(22,'Mohammad Meera','Mohiddin','Mohammad Meera Mohiddin','meera@tworks.in','+918185014342','$2b$10$IquAQdv2.PA4mAkP05uep.D1XXFoWto7iNaVz9HTn3T67C.EBPH3S','Lead','Assoclate Director - Plant Maintenance & Facilities',NULL,NULL,'2023-11-08 16:18:09','2023-11-09 05:49:51'),(23,'Shuja Ahmed','Khan Suri','Shuja Ahmed Khan Suri','shuja@tworks.in',NULL,'$2b$10$CWdFYJvNE8PCCT7l2bUQMeiB8n5fbAKnzz4TD8TyVb2lItn8lpadG','User','Assistant Manager - Aeronautical ',NULL,NULL,'2023-11-08 16:18:10','2023-11-08 16:18:10'),(24,'Mythili','Addepalli','Mythili Addepalli','mythili@tworks.in',NULL,'$2b$10$BDDrd1wd6NB/m/yah0e82.GcBwTWi.3w1toHKloDfyexRc9m9ORYS','User','Lead - Finance & Accounting',NULL,NULL,'2023-11-08 16:18:10','2023-11-08 16:18:10'),(25,'Damodar','Darshan Kolla','Damodar Darshan Kolla','darshan@tworks.in',NULL,'$2b$10$CmrK.iEqLyV6XSFc5e6LGelsJgRbmI.q/KwNrAe22L1f.W1EjNnkq','User','Associate -Engineer Electronics',NULL,NULL,'2023-11-08 16:18:11','2023-11-08 16:18:11'),(26,'Manish','Gunasekaran','Manish Gunasekaran','manishgunasekaran@tworks.in',NULL,'$2b$10$4Ubr8.gwvIPxGjqmx93ZRuxS2mwCxKgB8NPBRBp.xB5l1nRGrXGve','User','Senior Prototype Design Engineer',NULL,NULL,'2023-11-08 16:18:12','2023-11-08 16:18:12'),(27,'Padmini','Vuppala','Padmini Vuppala','vuppalapadmini@tworks.in',NULL,'$2b$10$6O/VTNuq.ZXL.Uyw8zdnG.TeQivbl.HU3YyRsS16yhNKEVg4dx6R.','User','Admin Assistant Manager',NULL,NULL,'2023-11-08 16:18:12','2023-11-08 16:18:12'),(28,'Yoshita','Lakshmi Pinjala','Yoshita Lakshmi Pinjala','yoshita@tworks.in',NULL,'$2b$10$SoPTiU5HqvV216K4hoxzZ.cSCXeULBUw1j3B6a3d57r8U8XZ3TbBq','User','Lead - Contextual & Spatial Designer',NULL,NULL,'2023-11-08 16:18:13','2023-11-08 16:18:13'),(29,'Rahil','Hasan','Rahil Hasan','rahilhasan@tworks.in',NULL,'$2b$10$CdLyeNxobc3nYePz2DZhDujefrsoBxH8UPnHOidGYiOXZCnqoBoy6','User','Designer',NULL,NULL,'2023-11-08 16:18:13','2023-11-08 16:18:13'),(30,'Yashwanth','Vudathu','Yashwanth Vudathu','yashwanthvudathu@tworks.in',NULL,'$2b$10$eITShVrBLaWqrtrz9chhsuBag5TRQRmpK5iGUsl9SN6wfgpXp76Bu','User','Rapid Prototyping Specialist',NULL,NULL,'2023-11-08 16:18:14','2023-11-08 16:18:14'),(31,'Riddi Rao','Cherla','Riddi Rao Cherla','riddi@tworks.in',NULL,'$2b$10$DhxPkCFse94AIUgMf0QcAeu0R.LYsir4.mxBDHZLulF0Y9r047LX2','User','Prototype Design Engineer',NULL,NULL,'2023-11-08 16:18:15','2023-11-08 16:18:15'),(32,'Gopi','Krishna Gontiyala','Gopi Krishna Gontiyala','gopikrishna@tworks.in',NULL,'$2b$10$CVG54rkDDuVRFFmMd.eTt.lfp1.qbCWgiefih.A7wXj8IWJsN20me','User','Procurement Specialist',NULL,NULL,'2023-11-08 16:18:15','2023-11-08 16:18:15'),(33,'Naomi','Kundu','Naomi Kundu','naomi@tworks.in',NULL,'$2b$10$URClH/aPmXqS2B1ydLrgxufP3mkm0T3kLXtRj2lEnzWaIKhUUTgLy','User','Pottery Studio Manager',NULL,NULL,'2023-11-08 16:18:16','2023-11-08 16:18:16'),(34,'Ankush','Goyal','Ankush Goyal','ankush@tworks.in',NULL,'$2b$10$9vcYOde5lwFVIbFj73Pz0ujLVmTMSpCByOwYJDhAVPjB9JEJeKQD6','User','Senior Electronics Engineer',NULL,NULL,'2023-11-08 16:18:16','2023-11-08 16:18:16'),(35,'Gaduthuri John','Nitin Joshee','Gaduthuri John Nitin Joshee','j.nitin@tworks.in',NULL,'$2b$10$h7YBDDOxoBJL6tfuAoV1j.PIVI/.VdscUm6mK6rP5eWaMram0Iqgu','User','Associate Engineer- Rapid Prototyping',NULL,NULL,'2023-11-08 16:18:17','2023-11-08 16:18:17'),(36,'Veerabhadra','Rao chappi','Veerabhadra Rao chappi','veera@tworks.in','+919866661553','$2b$10$KkM01bbIB2KjryioHTe.S.XAAvXVkPGwp5OJ1/CQIOj.nt5Sto6ZW','Lead','Director - Partnership People and Culture',NULL,NULL,'2023-11-08 16:18:18','2023-11-09 05:50:22'),(37,'Nehal','Sarangkar','Nehal Sarangkar','nehal@tworks.in',NULL,'$2b$10$l58mnAO9ZxcDL6NlyWn5R.RAMsXdCFe8aTgh.VflUU/XSd08lYuSa','User','Senior - Prototype Design Engineer',NULL,NULL,'2023-11-08 16:18:18','2023-11-08 16:18:18'),(38,'Akankasha','Joharapurkar','Akankasha Joharapurkar','akanksha@tworks.in',NULL,'$2b$10$Kktu4DLMdUsaDbUagdY82uWpjZ1PUtWGwmO4ZLrRL/U4lA9oUX3lW','User','Senior - Industrial Designer',NULL,NULL,'2023-11-08 16:18:19','2023-11-08 16:18:19'),(39,'Masrath','Sultana','Masrath Sultana','masrathsultana@tworks.in','+918465079938','$2b$10$6wBeBSlU26qRWW/8ao2kU.80j3tOhIk/J1K8eQU1WOGuc/W3WwTSC','User','Associate Prototype Design Engineer',NULL,NULL,'2023-11-08 16:18:19','2023-11-08 16:18:19'),(40,'Rahul','Reddy Amireddy','Rahul Reddy Amireddy','rahul@tworks.in',NULL,'$2b$10$1PJhh.vk8sdEKncNOHCxIOzZ4gurx6OAyDqLO5yIv9Xp3R6xDlZXa','User','Associate Engineer',NULL,NULL,'2023-11-08 16:18:20','2023-11-08 16:18:20'),(41,'Nirmit','Naha','Nirmit Naha','nirmit@tworks.in',NULL,'$2b$10$.ZkGGEvaRcaQiVeeotOTAOMec0pN1o7KgfDQPC0bYK0v/EkWlkLJG','User','Associate Prototype Design Engineer',NULL,NULL,'2023-11-08 16:18:20','2023-11-08 16:18:20'),(42,'Swetha','Maniyoor','Swetha Maniyoor','maniyoorswetha@tworks.in',NULL,'$2b$10$2yvrfVu8iH8NL7uLKjImV.yxwD1z6e35uf58e.AlU85gIiL8.bNe2','User','Graphic designer',NULL,NULL,'2023-11-08 16:18:21','2023-11-08 16:18:21'),(43,'Raj Kumar','Sharma','Raj Kumar Sharma','rajkumar.s@tworks.in',NULL,'$2b$10$PonfpbrxMlfZ6s7wOVnpYOF4aI/O5TdVE1/jkcXzBdt3/j4GdGeTe','User','Apprentice',NULL,NULL,'2023-11-08 16:18:22','2023-11-08 16:18:22'),(44,'Suhas','Patlolla','Patlolla Suhas','suhaspatlolla@tworks.in',NULL,'$2b$10$l2VbBvS5aOja1ni1ZGQTP.zDcOIgC./Azf67mSI3NWCiGppcY3UBi','User','Associe - Engineer Electronics',NULL,NULL,'2023-11-08 16:18:22','2023-11-08 16:18:22'),(45,'Oorja','Shettigari ','Oorja Shettigari','oorja@tworks.in',NULL,'$2b$10$mpg5fAiSemnRL5akLrMxAeOQz84ig4m478DgAnHe8TITx46W8Htrm','User','Associate- Textile Designer',NULL,NULL,'2023-11-08 16:18:23','2023-11-08 16:18:23'),(46,'Kaithi','Poojith Raj  Patel','Kaithi Poojith Raj Patel','poojith@tworks.in',NULL,'$2b$10$Po.eqxlceOt3hUiaPdx5OOLb4n5Yp2oOSIdE7Pe2VQLrWpLW3Jy0i','User','3D Printing Apprentice',NULL,NULL,'2023-11-08 16:18:23','2023-11-08 16:18:23'),(47,'Aluru V Siva','Charana Datta','Aluru V Siva Charana Datta ','shivacharan@tworks.in',NULL,'$2b$10$of5T791khzR6YnSCqYJ4mO246NBcoi.m4MA6Nttit5q95t8YN7gPW','User','Associate - Prototype Design Engineer',NULL,NULL,'2023-11-08 16:18:24','2023-11-08 16:18:24'),(48,'Ravariya','Ashleshaben Jagdishbhai','Ravariya Ashleshaben Jagdishbhai','ravi@tworks.in',NULL,'$2b$10$zvNzvIEVOrFOdtM6GTwn8uuqessEELjJEvl8uVTAaS6m9GMRoPMxK','User','Associate- Ceramic Craft',NULL,NULL,'2023-11-08 16:18:25','2023-11-08 16:18:25'),(49,'Nikhila','Atkuri Sai','Atkuri Sai Nikhila','sainikhila@tworks.in','+919390647305','$2b$10$55t8J.Rf/AgUF9/I4E4iuOy17jwQaEhibw2OImSmtg3.slMdLW2Tq','User','Associate- Full Stack Developer',NULL,NULL,'2023-11-08 16:18:25','2023-11-08 16:18:25'),(50,'Avala Dhanush','Reddy','Avala Dhanush Reddy ','dhanush@tworks.in',NULL,'$2b$10$l2R8Nspgz7GcJq.v8L9OC.BqtTmi7RMIcfhHY36kvRcrMFxPChVp2','User','Associate - Prototype Design Engineer',NULL,NULL,'2023-11-08 16:18:26','2023-11-08 16:18:26'),(51,'Shreyans','Harsora','Shreyans Harsora','shreyans@tworks.in',NULL,'$2b$10$ZTi5JbHKVB5NQyNs.5xeX.CAG8NhHyi.1CRyAeOu4pXTtDvidTllS','User','Associate - Product Designer',NULL,NULL,'2023-11-08 16:18:26','2023-11-08 16:18:26'),(52,'Jatin','Arrvapalli','Jatin Arrvapalli','jatin@tworks.in',NULL,'$2b$10$RLZEhbOWt9IKnWg/hwHwzuAOMFe4wddiz5J712YVaKyljwZ5i2m6S','User','External Consultant',NULL,NULL,'2023-11-08 16:18:27','2023-11-08 16:18:27'),(53,'Chetan',NULL,'Chetan','chetan@tworks.in',NULL,'$2b$10$BAenCZ8GCw7/noaxlaIiHeuHlB39he2MT8Ek3kNI8Qo8dn3PJICHm','User','External Consultant',NULL,NULL,'2023-11-08 16:18:27','2023-11-08 16:18:27'),(54,'Ashok','Gorre','Ashok Gorre','ashok@tworks.in',NULL,'$2b$10$C8xOeLMwfd4TNSwNCCc48.GUj4bZ7aemVbVlwFcM0LEQ1BtzgyANy','User','Junior Fellow',NULL,NULL,'2023-11-08 16:18:28','2023-11-08 16:18:28'),(55,'Rajendra','Gaddam','Rajendra Prasad Gaddam','rajendra@tworks.in',NULL,'$2b$10$mT1ElrJSpJWWLEhjKeRFZu2QGIw/zou6Eea9CmtIObNDzsY8QwFuG','User','Junior Fellow',NULL,NULL,'2023-11-08 16:18:29','2023-11-08 16:18:29'),(56,'Shekar','Kollanolla','Shekar Kollanolla','k.shekar@tworks.in','+919441019793','$2b$10$lp6wtrrjDbAk1rzhtQQMQOFcL9xuLgR.Z163hJPNpvUWYpnzGenWq','User','Senior Fellow',NULL,NULL,'2023-11-08 16:18:29','2023-11-08 16:18:29'),(57,'Suresh',' Chandra Narisetty','Suresh Chandra Narisetty','sureshchandra@tworks.in',NULL,'$2b$10$RgoCR1TaGQNOW9zceYdFW.tRSg7ZruK03mk6Op2B0qQ10CyCCIxwO','User','Senior fellow',NULL,NULL,'2023-11-08 16:18:30','2023-11-08 16:18:30'),(58,'Sri','Harsha  Kanumalla','Sri Harsha Kanumalla','sriharsha@tworks.in',NULL,'$2b$10$A9we1ZsOpyXj902BmR7ANeiqfQRJwOUtG7lVBryYh0CNbKXLqpbKe','User','Fellow',NULL,NULL,'2023-11-08 16:18:30','2023-11-08 16:18:30'),(59,'Sandeep','Yasa','Sandeep Yasa','sandeep@tworks.in','+919985803004','$2b$10$hySfLorN2j9plKQxEmsAFuFBxVjQAr8yu2Q12no6/QbR8MGwiRsuW','User','Senior fellow',NULL,NULL,'2023-11-08 16:18:31','2023-11-08 16:18:31'),(60,'Feroz','Zaheer','Feroz Zaheer','zaheer@tworks.in',NULL,'$2b$10$GrI64wlfl95Rm9HA66bE/.wy875in.YlAQXsYI.7NxC/6b7vr4XrG','User','Senior Fellow',NULL,NULL,'2023-11-08 16:18:32','2023-11-08 16:18:32'),(62,'Kannoju','Naveen','Kannoju Naveen','naveen@tworks.in',NULL,'$2b$10$FyiIFFVGsJ78Xq5FhbDQ6uhtwv1udSYQNyVCRptCbiPMbWSEVBmHu','User','Junior Fellow',NULL,NULL,'2023-11-08 16:18:33','2023-11-08 16:18:33'),(63,'Mohd','Imran','Mohd Imran','mohdimran@tworks.in',NULL,'$2b$10$sopVEJagDrA9BcIBNtSNtuSWzu9IyEDLG6z9UWZ0JPcG3MPCnBAV.','User','Intern',NULL,NULL,'2023-11-08 16:18:33','2023-11-08 16:18:33'),(64,'Vedarsh','Vedarsh Reddy','Muniratnam Vedarsh Reddy','vedarshreddy@tworks.in',NULL,'$2b$10$eTbX39A.DBFR6jJjbHOQ0.SxwLQBKvxFUz/c6.9Hvj09N4cjicZzG','User','Product Development Intern',NULL,NULL,'2023-11-08 16:18:34','2023-11-08 16:18:34'),(65,'Ramasagaram','Rahul Chary','Ramasagaram Rahul Chary','rahulramasagaram@tworks.in',NULL,'$2b$10$p4oSUHbVfIrIGY9mLhrYNOVI7M0orvrpQA2TWieoiMm8ruEO/ypWC','User','Mechanical Intern',NULL,NULL,'2023-11-08 16:18:34','2023-11-08 16:18:34'),(66,'Gunda','Sai Aakanksha','Gunda Sai Aakanksha','saiaakanksha@tworks.in',NULL,'$2b$10$7XM3FRzn0rLbFKCXbwX2Cu8iji5BcSO0hrPnzuoCxFl6bpK2//.zm','User','Electronics Intern',NULL,NULL,'2023-11-08 16:18:35','2023-11-08 16:18:35'),(67,'Aaluri','Reddy','Aaluri Reddy','praveen@tworks.in',NULL,'$2b$10$bLiwxc8.n7JoFvqyUZyseO0Al9PdQwLqx3caz2m85nw3Tb2yfnXtC','User','Mechanical Intern',NULL,NULL,'2023-11-08 16:18:36','2023-11-08 16:18:36'),(68,'Adhityan','Ravichandran','Adhityan Ravichandran','adhityan@tworks.in',NULL,'$2b$10$qFYRBRPHsXglo8uD/4HOKutPD3FO3SOCYn5V6GJCcw/bWAmZZji52','User','Design Intern',NULL,NULL,'2023-11-08 16:18:36','2023-11-08 16:18:36'),(69,'Abdul','Wahab','Abdul Wahab','abdul.w@tworks.in',NULL,'$2b$10$oguKzp8PhMhrnZ0hsT.FVuXYg8f43Iox8XJReiUBJbRRa.cZnHRfG','User','UAV Intern',NULL,NULL,'2023-11-08 16:18:37','2023-11-08 16:18:37'),(70,'Manoj Kumar','Reddy','C. Manoj Kumar Reddy','manoj.k@tworks.in',NULL,'$2b$10$w1.PRoba0g50EGrM7fqxRuxy2CU9VaxGKshKQuwY93anLhbsuqhzW','User','UAV Intern',NULL,NULL,'2023-11-08 16:18:37','2023-11-08 16:18:37'),(71,'Barkavi','S','Barkavi S','barkavi@tworks.in',NULL,'$2b$10$iu21sr7GxGSjlnamBuT9Ie.yLc3gNXSNTocbQ.ENNBz8czIgpYwRW','User','Design intern ',NULL,NULL,'2023-11-08 16:18:38','2023-11-08 16:18:38'),(72,'Potla Bharath','Sai','Potla Bharath Sai','bharat@tworks.in',NULL,'$2b$10$tl4hZL9X8E9DbOQnrA9Jj.oaqYj38/pn6Ns5WOGBo4BI1I83K5n72','User','Photography Intern',NULL,NULL,'2023-11-08 16:18:39','2023-11-08 16:18:39'),(73,'Mir Omar','Ali khan','Mir Omar Ali khan','mir@tworks.in',NULL,'$2b$10$xXw8JF5nF2OaUepr2KvnJuY8USOgwqxnC9A4o7QHzZBp4OTm5nxfK','User','Woodworking Intern',NULL,NULL,'2023-11-08 16:18:39','2023-11-08 16:18:39'),(74,'Sai Priyatham','Sriramou','Sai Priyatham Sriramou','sai@tworks.in',NULL,'$2b$10$UP0EGLuy109Ib5Ac2eeTSO6sBw4NYE/kpZfSZCvOCVdNrGArAD7/O','User','Mechanical Intern',NULL,NULL,'2023-11-08 16:18:40','2023-11-08 16:18:40'),(75,'Chiruvolu Vishnu','Teja','Chiruvolu Vishnu Teja','chiruvolu@tworks.in',NULL,'$2b$10$1YRTqqAykbr39x5MYtld3elfrgEW2YDo7ElOoAHIwpjR4AsPfUkQW','User','Electronics Intern',NULL,NULL,'2023-11-08 16:18:40','2023-11-08 16:18:40'),(76,'Guguloth Ram','Prasad Naik','Guguloth Ram Prasad Naik','prasad@tworks.in',NULL,'$2b$10$R7McW7kBdy.XTHykFalVh.JJZEpU5e64mSTAqhv1nt9YKFx3XgVjm','User','Product Design Intern',NULL,NULL,'2023-11-08 16:18:41','2023-11-08 16:18:41'),(77,'Pawan','Teja','Pawan Teja','pawan@tworks.in',NULL,'$2b$10$oxLKIqC.2w3Kqfbk1CLb4.ZnhK.8Uhn9ObvEUebujb9KXJXH2NeYq','User','Electronics Intern',NULL,NULL,'2023-11-08 16:18:41','2023-11-08 16:18:41'),(78,'Mohammed Suhail',' Roushan Ali','Mohammed Suhail Roushan Ali','suhail@tworks.in','+919618211626','$2b$10$i.CLuyLmv4nqGFHGsWEnpeTkjllf4RI.dkxTy0mMxGdbFJTj8gX6S','User','Software Intern',NULL,NULL,'2023-11-08 16:18:42','2023-11-08 16:18:42'),(79,'Hiral','Shah','Hiral Shah','hiral@tworks.in','+919623454541','$2b$10$AI5hVWv7eeoYRkRDraQCwO7wJL2gAyTyrdcZTwEgpdM5nFY0og1o6','User','Apprentice',NULL,NULL,'2023-11-08 16:18:43','2023-11-09 05:53:19'),(80,'Karampudi','Pranav','Karampudi Pranav','karampudi@tworks.in',NULL,'$2b$10$qqX.iF566zhXPlPjXKHpTe22JcY4vHgFRxeAKaUbAecQ4mxSbGm5y','User','Mechanical Intern',NULL,NULL,'2023-11-08 16:18:43','2023-11-08 16:18:43'),(81,'Nidhi','Jain','Nidhi Jain','nidhi@tworks.in',NULL,'$2b$10$TnzakejAaOvS1Af1JCroNOMH1Csxl264Gvl8KzZY.N1qfDWBrWhVu','User','UAV Intern',NULL,NULL,'2023-11-08 16:18:44','2023-11-08 16:18:44'),(82,'Vedala Radha','Soundarya Sundar Ananth','Vedala Radha Soundarya Sundar Ananth','vedala@tworks.in',NULL,'$2b$10$n3Qh3W./ab83zOLoqp419Ovl9s.D1pnOs2TLWJc4GAdOupC3xHf3m','User','Electronics Intern',NULL,NULL,'2023-11-08 16:18:44','2023-11-08 16:18:44'),(83,'Karthikraj','S','S Karthikraj','karthik@tworks.in','+917675881418','$2b$10$zms8NbU5LIpL7L.JUHI.R.Dd.a1tY8ZU9xU/A8LIY3JB.0/EOuBja','User','Electronics Intern',NULL,NULL,'2023-11-08 16:18:45','2023-11-09 05:52:04'),(84,'Korandlaa','Laasyasri','Korandla Laasyasri','korandlaa@tworks.in',NULL,'$2b$10$.pEgpxwGfN4Dye5PIfqaYOaO8AbBVwqsX7Ep0cUZfK5/idQZxerGC','User','Operations Intern',NULL,NULL,'2023-11-08 16:18:46','2023-11-08 16:18:46');
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

-- Dump completed on 2023-11-09 12:40:20

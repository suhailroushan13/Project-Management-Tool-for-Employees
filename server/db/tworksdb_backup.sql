-- MySQL dump 10.13  Distrib 8.0.34, for Linux (x86_64)
--
-- Host: localhost    Database: tworksdb
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

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
  `username` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','lead','owner','developer','designer','client') NOT NULL,
  `profileImageUrl` varchar(255) DEFAULT NULL,
  `bio` text,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','Admin','Admin','admin@tworks.in','+919618211626','$2b$10$M/Z41LHtZ1wK9DZzGIwWw.s8/2lrWVMUfuIytX4mQuRqkGLthdhrW','admin',NULL,NULL,0,'2023-10-15 22:17:48','2023-10-15 22:17:48'),(2,'nikhila','Nikhila','Atkuri','sainikhila@tworks.in','+919390647305','$2b$10$mi9eVfKWCc/ax1r5nXMBMejTnvlPfeP0Pn96W.NDhKuX8Nr9PSnai','admin',NULL,NULL,0,'2023-10-16 12:36:11','2023-10-16 12:36:11');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentattachments`
--

DROP TABLE IF EXISTS `commentattachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentattachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filePath` text,
  `fileType` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `commentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commentId` (`commentId`),
  CONSTRAINT `commentattachments_ibfk_1` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentattachments`
--

LOCK TABLES `commentattachments` WRITE;
/*!40000 ALTER TABLE `commentattachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentattachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `projectId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `userId` (`userId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'fgf','2023-10-11 18:14:11','2023-10-11 18:14:11',134,NULL),(2,'fgf','2023-10-11 18:14:12','2023-10-11 18:14:12',134,NULL),(3,'fgf','2023-10-11 18:14:12','2023-10-11 18:14:12',134,NULL),(4,'fgf','2023-10-11 18:14:12','2023-10-11 18:14:12',134,NULL),(5,'fgbf','2023-10-15 22:18:21','2023-10-15 22:18:22',134,NULL);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
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
  `status` enum('NOT STARTED','ON HOLD','OVERDUE','IN PROGRESS','COMPLETED','TO BE REVIEWED BY CEO','READY FOR EXECUTION','CANCELED') DEFAULT NULL,
  `nextReview` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (2,'Community Hackathon','Conduct a hackathon/make-a-thon in June/July for 1-2 days for external participants. They will not stay in the premises though.','Firoz','Darshan','2023-09-17','HIGH','IN PROGRESS','2023-08-09','2023-10-10 07:26:45','2023-10-10 07:26:45'),(3,'RIDP','Futher secondary research for finalising RIDP program','Firoz','KPMG','2023-08-17','HIGH','IN PROGRESS','2023-08-17','2023-10-10 07:26:45','2023-10-10 07:26:45'),(4,'Hike letters','Issuing of hike letters to employees','Veera','Likitha','2023-08-17','HIGH','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(5,'good vs bad design','','Veera','TJ','2023-08-11','HIGH','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(6,'Posters - Come fail, Learn & Build ','Wall graphics','Veera','Swetha','2023-08-15','MEDIUM','COMPLETED','2023-08-10','2023-10-10 07:26:45','2023-10-10 07:26:45'),(7,'AI workshops','Workshop on all tools available for AI','Veera','TJ','2023-08-09','NA','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(8,'Equipment  competition','Extended Zund challenge to all major equipment','Firoz','Varun','','HIGH','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(9,'EA to CEO hire','Need to hire a EA to CEO','Anand','Anand','2023-07-28','HIGH','IN PROGRESS','2023-08-10','2023-10-10 07:26:45','2023-10-10 07:26:45'),(10,'Internship completion letters ','Give internship completion letter to interns','Veera','Likitha','2023-08-05','MEDIUM','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(11,'Minister -response to funds letter','Letter authorising VCMD from PS and minister','Raj','Mythilli','','HIGH','COMPLETED','2023-08-09','2023-10-10 07:26:45','2023-10-10 07:26:45'),(12,'Exclusive T-Merch','Free, limited edition for staff only, generic merch for visitors/sale. Opening up a Merch vertical - Getting people to design objects + aligning in the same direction','Sanjay','Yoshita','','HIGH','NOT STARTED','2023-08-13','2023-10-10 07:26:45','2023-10-10 07:26:45'),(13,'ERP Next','ERP implementation in the organisation','Firoz','Varun','','HIGH','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(14,'Mementos (personalised, generic)','They make, we make. Mementos for guests and visitors at T-Works. Some can be personalised for important people.','Sanjay','Nehal','','HIGH','ON HOLD','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(15,'Sensor Lab','100 Cr procurement (Sensors + Actuators)','Sanjay','Madhav','','HIGH','ON HOLD','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(16,'Vertical stacking furniture for residents','Micro studios for the users renting the space - now would be a part of phase 1.5','Sanjay','Yoshita','','HIGH','ON HOLD','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(17,'Software interns','','Veera','Likitha','','MEDIUM','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(18,'Interim hike letters','To handover','Veera','Likitha','','HIGH','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(19,'Designation changes to reflect','To handover','Veera','Likitha','','HIGH','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(20,'ERP Vendor visit','ERP Vendor visit','Firoz','Varun','','HIGH','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(21,'The Byte Bending Championship - T-Works Embedded Challenge','Held a two day challenge for participants ','Firoz','Darshan','2023-09-17','HIGH','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(22,'Org Structure','If the current reporting structure is entered into the ERP HR database, the org structure is created automatically. Please do this today.','Veera','Likitha','2023-07-24','HIGH','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(23,'Workshops','Curriculum, Materials, Pipeline of trainers for conducting workshops/trainings','Veera','TJ','','HIGH','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(24,'Lockheed Martin, Boeing introductions','Work with US consulate (Salil) for introductions for LM and Boeing','Veera','Anand','2023-08-22','HIGH','IN PROGRESS','2023-08-22','2023-10-10 07:26:45','2023-10-10 07:26:45'),(25,'T-Works lettering in atrium','','Sanjay','Yoshita','','HIGH','NOT STARTED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(26,'72 hr challenge #2','Plan a second 72 hr challenge in August 2023','Firoz','Sharat','','HIGH','NOT STARTED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(27,'Grainpro','FTO study, prototype','Firoz','Firoz','2023-09-15','HIGH','NOT STARTED','2023-08-13','2023-10-10 07:26:45','2023-10-10 07:26:45'),(28,'Drone racing','','Firoz','Captain MFH','','HIGH','NOT STARTED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(29,'Blogs, newsletters','release the edition every month through an emailer','Veera','ZF','','HIGH','IN PROGRESS','2023-08-08','2023-10-10 07:26:45','2023-10-10 07:26:45'),(30,'Everyone should conduct a workshop atleast once','','Veera','TJ','','HIGH','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(31,'go full throttle  on ceramics workship','','Veera','TJ','','HIGH','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(32,'School kits (Maker Box)',' Maker box is a kit for school kids designed to stimulate thinking by providing access to a carefully curated selection of materials, technologies, and educational resources.','Sanjay','Akanksha','2023-09-30','MEDIUM','IN PROGRESS','2023-08-19','2023-10-10 07:26:45','2023-10-10 07:26:45'),(33,'Funding (Opex) letter to Minister','Get letter reviewed and sent','Raj','Raj','2023-06-27','NA','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(34,'battle bots','','Firoz','Captain MFH','','HIGH','NOT STARTED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(35,'Zund Challenge','Challenge the internal team to make something on the Zund through a competition','Sanjay','Shuja','2023-08-23','MEDIUM','COMPLETED','2023-08-23','2023-10-10 07:26:45','2023-10-10 07:26:45'),(36,'Fundraising (Capex)','Continue raising remaining 20 Cr from industry (Amara Raja, Tejas Networks, Greenko)','Anand','Sharat','2023-08-09','MEDIUM','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(37,'Sujai review finances','Outflow, income, granular and macro','Raj','Raj','','MEDIUM','TO BE REVIEWED BY CEO','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(38,'Change switches','Look, alignment','Meera','Meera','2023-07-31','MEDIUM','ON HOLD','2023-09-01','2023-10-10 07:26:45','2023-10-10 07:26:45'),(39,'Rewards and Recognition','Need to roll out R&R. Don’t need a comprehensive total rewards policy, only a couple of initiatives to start with. Something like a spot award and a quarterly award.','Veera','Likitha','2023-08-25','HIGH','READY FOR EXECUTION','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(40,'Chief Secretary invitation','Letter inviting CS to T-Works and T-Fiber NoC','Anand','Anand','2023-07-21','NA','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(41,'NDA for T-Works staff ','To protect the interests of external parties engaging with us.','Veera','Likitha','2023-08-17','HIGH','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(42,'Apprenticeship for shops','','Firoz','Firoz / Varun','','HIGH','NOT STARTED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(43,'Library books','Funding, listing, procurement','Anand','KPMG','2023-04-17','NA','ON HOLD','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(44,'Phone chargers in the board room','Board room, conf room, someplace in the lobby, powerbanks on rent','Meera','Meera','2023-07-22','NA','COMPLETED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(45,'setup textile equipment','','Firoz','Varun','','HIGH','NOT STARTED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(46,'Chaiminar','A 72 hr challenge event to design and make a Irani chai making machine. Complete it for regular use','Sanjay','Firoz','2023-08-30','MEDIUM','NOT STARTED','2023-08-15','2023-10-10 07:26:45','2023-10-10 07:26:45'),(47,'Friday Feature','time slot for internal team debates. Open to any topic related to T-Works and what we do.','Veera','TJ','2023-08-25','MEDIUM','NOT STARTED','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(48,'Safety officer requirement','Reaching out to the safety institutes, sending proposal, negotiations','Veera','Likitha','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(49,'Agreements and legal','MOU\'s, NDA\'s and User agreement','Raj','Mythilli','2023-07-31','MEDIUM','IN PROGRESS','','2023-10-10 07:26:45','2023-10-10 07:26:45'),(50,'Requesting mail access to Koundinya','*Mail access to Koundinya (Gmail)','Raj','Mythilli','2023-08-22','HIGH','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(51,'ICE gate','Customs clearance','Raj','Syed','2023-07-28','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(52,'SIRO Customs duty exemption process','Research about SIRO Customs duty, does it need more ?','Anand','Syed','2023-08-11','HIGH','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(53,'PCB Fab setup','Setting up of the PCB fab sponsered by Qualcomm','Firoz','Varun','','HIGH','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(54,'Phase 1 do up','Cleaning related to internal plantation','Meera','Meera','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(55,'Note file, templates for procurement','Deviation for procurement policy, single vendor, service','Raj','Mythilli','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(56,'Projects with interns in other departments - Budget for consumable Electronic parts','Based on projections stocking of commonly used electronic parts across multiple disciplines','Sanjay','Madhav','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(57,'Rate card','Review and sign-off on rate cards for rentals and proto services','Firoz','Firoz','2023-08-25','HIGH','READY FOR EXECUTION','2023-08-11','2023-10-10 07:26:46','2023-10-10 07:26:46'),(58,'Silver filigree','Designing and manufacturing machines to automate building blocks of filigree art form','Sanjay','Sharat','2023-09-25','HIGH','OVERDUE','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(59,'Dashcam','Enclosure design and low volume (12 units) prototyping','Sanjay','Sharat','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(60,'Drone in a box','Product design and manufacturing of a drone-in-a-box platform','Sanjay','Sharat','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(61,'Stewart platform','6-dof motion platform as a development kit','Sanjay','Sharat','','LOW','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(62,'Smartbox','Asset tracking system that sends alerts when the box is opened; used for tracking sensitive question papers','Sanjay','Sharat','','LOW','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(63,'Sprints - 2 axis delta PnP','a pick and place machine using vaccum ','Sanjay',' Siva','2023-08-30','LOW','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(64,'Sprints - Desktop mill','make an enlosure, finalise the electronics and make it functioning','Sanjay',' Nirmit','2023-08-21','LOW','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(65,'Sprints - Segway','Self balancing vehicle','Sanjay',' Absar','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(66,'Sprints - Weld positioner','Jig for cicular objects','Sanjay','Yashwanth','2023-08-31','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(67,'Reach out to academic institutions for engineering and management internships','Out of telangana search for interns','Veera','Likitha','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(68,'Assimilation plan','One week get-to-know the company plan. Need a document highlighting what we can do in one week.','Veera','Likitha','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(69,'ERP corrections','Trying to correct all the employee ID\'s','Veera','Likitha','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(70,'Graphic design interns','Reach out to colleges','Veera','Likitha','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(71,'Software experience people','','Veera','Likitha','','MEDIUM','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(72,'Build Web Page to capture Interview Feedbacks','','Veera','Likitha','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(73,'LoFi - Workshop','to host a workshop for external','Veera','TJ','2023-09-28','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(74,'World Skills','How can T-Works contribute/participate','Veera','Veera','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(75,'Residency','','Veera','Veera','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(76,'Carpenter upskilling','','Veera','TJ','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(77,'Media interviews','Arijit Burman ET','Veera','Veera','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(78,'sketching course for internal team','Sketching 101 for internal product team especially for mech folks','Veera','TJ','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(79,'Training needs and identification','Gathering internal training requirements and finding suitable institutions and facilitated to the employess','Veera','Likitha','','MEDIUM','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(80,'New Joinee PPT on Friday','Each Friday, along with usual activities (T-Debate etc), we can have a 5-10 min ppt by new joinees about what they do.','Veera','Likitha','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(81,'Employee handbook','We need an Employee Handbook for existing and new employees/interns to establish rules/guidelines/tips etc to accelerate the induction process.  ','Veera','ZF','','LOW','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(82,'Phase 1.5 conceptual art','setting a design direction for phase 1.5','Sanjay','Yoshita','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(83,'Team office design','designing work benches and other supporting objects in the space','Sanjay','Yoshita','','LOW','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(84,'Product Exhibition redesign','alternate design to the current product display','Sanjay','Yoshita','','MEDIUM','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(85,'Zund storage system','a creative storage for the ARP made on the Zund','Sanjay','Yoshita','2023-09-29','LOW','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(86,'Kinetic art installation','designing the event including community and in house staff','Sanjay','Yoshita','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(87,'Sujai inaugural speech clips','','Veera','ZF','','HIGH','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(88,'Improved Cookstove (ICS)','Design of an ICS with specific focus on design elements that makes the product user-friendly, efficient, and enviornmentally sustainable.','Sanjay','Simran','2023-09-30','MEDIUM','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(89,'Atom ZLT Disaster Relief Kit (DRK)','Design of a kit that includes upto 32 essential items related to shelter, food, and sanitation that a family of 4 would need in a relief camp in the event of immediate displacement ffrom their home due to natural disasters and/or war.  ','Sanjay','Simran','2023-09-25','MEDIUM','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(90,'Deloitte Scrolling White Board','Deloitte University requires a novel scrolling whiteboard design that can fit onto pillars in their training rooms. ','Sanjay','Simran','','MEDIUM','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(91,'Trismus Rehab Device ','The device is used to rehab patients suffering from trismus. The client has a novel idea of adding a force sensor to allow patients to measure their progress in being able to re-open their jaw. ','Sanjay','Simran','','MEDIUM','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(92,'UPS Industrial Design','client makes UPS and Inverters and would like help in the Industrial Redesign and addition of some features. ','Sanjay','Simran','','MEDIUM','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(93,'Artificial Heart Design Improvements','client is making a novel permanent artificial heart design. Currently they have a PoC and are looking to improve their mechanical design to meet functional requirements','Sanjay','Simran','','MEDIUM','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(94,'Deloitte Installation Repairs','There are two repairs to the DU Interaction Center which we are taking up:  1. William Deloitte Statue Hand Replacemement 2. Spinnign Wheel Redesign','Sanjay','Simran','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(95,'CCMB Silicone Projects','There are two minor design projects from CCMB: 1. Silicone Tube for NeoNatal Care Machine Redesign and Moulding 2. Silicone Sleeve for C-Section Tool','Sanjay','Simran','','LOW','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(96,'Vacuum Chamber Usage for Bamboo Fiber Imfusion','client is looking to use the vacuum chamber at T-Works but requires a custom steel vessel. They are fabricating it but will need to do custom silicone sleeve design and some metal shop work.   ','Sanjay','Simran','','LOW','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(97,'Flexible Materials Moulding ','Want to establish a flexible materials moulding lab to provide silicone and PU rubber moulding as an internal and external capability. ','Sanjay','Simran','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(98,'SLA Printing Guideline','Need a handbook for training users on how to use the SLA printer. ','Firoz','Simran/Nitin','','MEDIUM','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(99,'MSME IPFC Application','Application to MSME IPR facilitation cell','Raj','Raj','2023-08-11','HIGH','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(100,'Poster - POSH','Putting POSH  posters in the facility','Veera','Likitha','','HIGH','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(101,'Business modelling','Prepare a holistic business model with P&L projections','Veera','TJ','','HIGH','READY FOR EXECUTION','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(102,'Seed dropping pay load','Design and develop a seed ball dispensing drone payload','Sanjay','Shuja','2023-09-09','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(103,'Saral web - Sclear','POS style attendance system for muncipality workers','Sanjay','Firoz','2023-09-06','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(104,'Proto services','Services team to support inbound quiries','Firoz','Firoz','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(105,'Liability/warranty agreements','For external users to use the space and equipment','Raj','Mythilli/Tejaswini','2023-07-31','HIGH','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(106,'Achievements for FY 22-23','Solutions seekers and partnerships acheivements','Raj','Sreya/Anurag','2023-07-29','HIGH','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(107,'Sports.tworks','Internal sports activities. 6-a-side football, carrom, TT, basketball etc. Facilitate entry into inter-corporate tournaments in Hyd.','Veera','Likitha','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(108,'AIG Hospitals TNS box','The product is used to train doctors on how to perform a pituitary tumor resection through an endoscopic transsphenoidal approach.','Sanjay','Simran','','LOW','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(109,'Board review PPT ','Update on the agenda items for board meeting on 3rd Aug','Anand','KPMG','2023-08-03','HIGH','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(110,'Souvenir design','designing  a souvenier that can be given to t-works guests','Sanjay','Yoshita','2023-08-25','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(111,'CNC Circulation monitoring system','Accessory for HAAS','Sanjay','Madhav','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(112,'Neo natal suction system','medical device for endotrechial suctioning process','Sanjay','Darshan','2023-08-19','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(113,'Temperature caliberation system','temperature sensors and machining electronics needs to be validated with a wide range of temperature settings, this unit provides programmable temperatures','Sanjay','Suhas','','MEDIUM','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(114,'CRIDA - Rover','Agricultural BOT, Navigate through farrow in raised bed farming','Sanjay','Madhav','','LOW','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(115,'Chemo drug delivery system','bed side remote drug delivery system','Sanjay','Madhav','','LOW','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(116,'Funding (CAPEX) - Rs.29 Cr','To get Funds from State Finance/Budget Section','Raj','Raj','2023-09-10','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(117,'Entry and Exit gate Signages','Way finding signages at entry and exit gates','Meera','Meera','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(118,'Vendor machine installation','Installation of vendor machine in T-Works facility','Meera','Padmini','2023-08-22','HIGH','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(119,'Chaiminar movie','We hve a 34min movie on chaiminar. Have to break it up into 5 min clips with appropriate captions, titles etc.','Veera','ZF','','HIGH','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(120,'Project Management Portal','Make a in house portal which clearly defines team members on what their priority is, gives an idea about the workload to the management and where to hire people','Anand','Koundinya/Rahman','','HIGH','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(121,'Remuneration structure review','','Veera','Veera','','NA','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(122,'Product team mission','Articulate what we mean by prototype, what it is not etc','Sanjay','Sanjay','','NA','TO BE REVIEWED BY CEO','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(123,'Logo design (T-Works logo) competition','','Sanjay','Swetha','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(124,'VIP washroom','EAST side second floor washroom to be converted to VIP washroom','Meera','Meera','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(125,'Structure over building','Conflict with phase 3? Art installations, internal artwork','Sanjay','Yoshita','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(126,'Mat under urinal','Have to discuss','Meera','Meera','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(127,'External lighting','Landscaping and roof lighting','Meera','Meera','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(128,'Star ratings for external consultants, ecosystem partner vendors','','Firoz','Veera/Anurag','','NA','NOT STARTED','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(129,'Aeroplane structure in atrium','','Firoz','Varun','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(130,'Phase 1.5/2','Requirements, design, construction','Firoz','Varun/Meera','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(131,'Ai Tour Guide','Industrial Design for AI Tour Guide, a handheld device that will guide visitors to go around T-Works.','Sanjay','Akanksha','2023-08-28','NA','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(132,'Milk analyser','TFIR based milk analyser - building a benchtop POC in collab with their team','Sanjay','Sharat','','NA','IN PROGRESS','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(133,'T-Works University','','Veera','TJ','','NA','ON HOLD','','2023-10-10 07:26:46','2023-10-10 07:26:46'),(134,'Creating an external services roster of designers, engineers, fabricators etc','','Sanjay','Sanjay','','NA','COMPLETED','','2023-10-10 07:26:46','2023-10-10 07:26:46');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','lead','owner','developer','designer','client','user') NOT NULL,
  `profileImageUrl` varchar(255) DEFAULT NULL,
  `bio` text,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'anand','Anand','Rajagopalan','anand@tworks.in','+919618211626','$2b$10$OvbF3h6XRHIxCkG/HeAbLev.vWzFFT98etU1iYJVK4kx.i5pcbbXm','lead',NULL,NULL,0,'2023-10-16 10:24:05','2023-10-16 10:24:05'),(2,'meera','Mohammad Mohiddin','Meera','meera@tworks.in','+919618211625','$2b$10$OusKhhQq.hQkU5VRsAB5y.irZsEBWKMg3JL4gMwja7i66huPMl1W6','lead',NULL,NULL,0,'2023-10-16 10:24:06','2023-10-16 10:24:06'),(3,'veera','Veera','Chappi','veera@tworks.in','+919618211620','$2b$10$lU.HC6cAyRK9UG1yYDA8RuBHUYeKlCUaVncFyK7JGm9geIXr4sW9e','lead',NULL,NULL,0,'2023-10-16 10:24:06','2023-10-16 10:24:06'),(4,'sanjay','Sanjay','Gajjala Kumar','sanjay@tworks.in','+919618211621','$2b$10$UTh1ogw8Sql2W54Vl5nMCeW2iEbN5OJJqBV7HkpSvz67ebaLmU0Gu','lead',NULL,NULL,0,'2023-10-16 10:24:06','2023-10-16 10:24:06'),(5,'firoz','Firoz','Ahammad','firoz@tworks.in','+919618211627','$2b$10$HZR2R5qV3X5i8HwcHg2X/uU5qfg/LrHuEPHIVsG7KnHzyVp9KuLQG','lead',NULL,NULL,0,'2023-10-16 10:24:06','2023-10-16 10:24:06'),(6,'rajshekhar','Raj','Shekhar','rajshekhar@tworks.in','+919618211622','$2b$10$ygGJ9UJUBN7REHuKe.2VOeEUnsPYE3q.K8BGHXmVN08/8ZwTHdESW','lead',NULL,NULL,0,'2023-10-16 10:24:07','2023-10-16 10:24:07');
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

-- Dump completed on 2023-10-16 18:23:28

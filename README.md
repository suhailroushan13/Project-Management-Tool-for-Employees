
# Squad App Setup

The Project Management Tool designed for TWorks is a powerful and efficient solution tailored to streamline task management and communication within the TWorks organization. This tool is specifically crafted to meet the unique needs and demands of TWorks teams, offering seamless task reminders and notification capabilities to enhance productivity and collaboration.


### Installation

```bash
git clone git@bitbucket.org:tworksrepos/newsquad.git
cd newsquad

```

### Client Side
```bash
cd client
npm install 
npm start
```

### Server Side
```bash
cd server
npm install
npm start
```

### Export & Import of DataBase
```bash
#Export DataBase
mysqldump -u suhail -p tworksdb > tworksdb_backup.sql


#Import DataBase
mysql -u suhail -p tworksdb < tworksdb_backup.sql

```



mkdir server 
cd server 
mkdir config controllers models
touch .gitignore 
echo "node_modules" > .gitignore
cd config 
touch default.json
cd ..
npm init -y 
touch app.js 
npm i express config jsonwebtoken bcrypt axios sequelize morgan cors 


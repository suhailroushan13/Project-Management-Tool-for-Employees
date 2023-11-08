import fs from "fs/promises";

let getData = async () => {
  try {
    let read = await fs.readFile("./alluser.json", "utf-8");
    let stringToObject = JSON.parse(read);
    let map = stringToObject.map((x) => {
      return x.firstName;
    });
    console.log(map);
  } catch (error) {
    console.log(error);
  }
};

getData();

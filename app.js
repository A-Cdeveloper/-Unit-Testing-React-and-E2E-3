import { faker } from "@faker-js/faker";
import * as fs from "fs";
const generatePostsData = (number) => {
  const posts = [];
  while (number >= 0) {
    posts.push({
      id: number,
      title: faker.commerce.productName(),
    });
    number--;
  }
  return posts;
};
fs.writeFileSync("./db.json", JSON.stringify({ posts: generatePostsData(20) }));

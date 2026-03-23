const fs = require('fs/promises');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'products.json');

async function readProducts() {
  const data = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(data);
}

async function writeProducts(products) {
  await fs.writeFile(dataPath, JSON.stringify(products, null, 2), 'utf-8');
}

module.exports = {
  readProducts,
  writeProducts,
};

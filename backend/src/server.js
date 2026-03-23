const express = require('express');
const cors = require('cors');
const { readProducts, writeProducts } = require('./productService');

const app = express();
const PORT = Number.parseInt(process.env.PORT, 10) || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function validateProductInput(body) {
  const { name, category, price, image, stock } = body;

  if (
    name === undefined ||
    category === undefined ||
    price === undefined ||
    image === undefined ||
    stock === undefined
  ) {
    return 'Thiếu field bắt buộc.';
  }

  if (typeof name !== 'string' || !name.trim()) return 'name phải là chuỗi hợp lệ.';
  if (typeof category !== 'string' || !category.trim()) return 'category phải là chuỗi hợp lệ.';
  if (typeof image !== 'string' || !image.trim()) return 'image phải là chuỗi hợp lệ.';
  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) return 'price phải > 0.';
  if (typeof stock !== 'number' || Number.isNaN(stock) || stock < 0) return 'stock phải >= 0.';

  return null;
}

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running on port 5000' });
});

app.get('/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let products = await readProducts();

    if (category) {
      products = products.filter(
        (product) => product.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (search) {
      const keyword = String(search).toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(keyword) ||
          product.category.toLowerCase().includes(keyword)
      );
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đọc danh sách sản phẩm.', error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = await readProducts();
    const product = products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đọc chi tiết sản phẩm.', error: error.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const validationError = validateProductInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const products = await readProducts();
    const nextId = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;

    const newProduct = {
      id: nextId,
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      price: req.body.price,
      image: req.body.image.trim(),
      stock: req.body.stock,
    };

    products.push(newProduct);
    await writeProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm sản phẩm.', error: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const validationError = validateProductInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const products = await readProducts();
    const index = products.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    const updatedProduct = {
      id,
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      price: req.body.price,
      image: req.body.image.trim(),
      stock: req.body.stock,
    };

    products[index] = updatedProduct;
    await writeProducts(products);

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm.', error: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = await readProducts();
    const index = products.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    const deletedProduct = products[index];
    products.splice(index, 1);
    await writeProducts(products);

    res.json({ message: 'Xóa sản phẩm thành công.', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm.', error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint không tồn tại.' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} đang được sử dụng. Hãy tắt process đang chạy hoặc đổi PORT rồi thử lại.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

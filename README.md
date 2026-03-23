# Midterm Full-Stack App

Project làm theo yêu cầu đề bài:
- Frontend: React + Vite
- Backend: Node.js + Express
- Giao tiếp: REST API
- Dữ liệu: JSON file (không dùng database)

## Cấu trúc thư mục

```bash
midterm-app/
├── backend/
│   ├── data/products.json
│   ├── src/productService.js
│   ├── src/server.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/components/
│   ├── src/App.jsx
│   ├── src/main.jsx
│   ├── src/styles.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Cách chạy bằng VS Code

### 1. Mở project
- Giải nén file zip
- Mở folder `midterm-app` bằng VS Code

### 2. Chạy backend
```bash
cd backend
npm install
npm run dev
```
Backend chạy tại: `http://localhost:5000`

Nếu muốn chạy trực tiếp bằng Node:
```bash
cd backend
node server.js
```

### 3. Chạy frontend
Mở terminal mới:
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại: `http://localhost:5173`

## API hỗ trợ

### GET /products
- Lấy tất cả sản phẩm
- Có hỗ trợ:
  - `?category=Phone`
  - `?search=iphone`

### GET /products/:id
- Lấy chi tiết sản phẩm theo id

### POST /products
- Thêm sản phẩm mới
- Validate:
  - Không thiếu field
  - `price > 0`
  - `stock >= 0`

### PUT /products/:id
- Cập nhật sản phẩm

### DELETE /products/:id
- Xóa sản phẩm

## Chức năng frontend
- Hiển thị danh sách sản phẩm
- Thêm sản phẩm
- Sửa sản phẩm
- Xóa sản phẩm
- Xem chi tiết sản phẩm
- Loading state
- Error handling
- Search sản phẩm
- Filter theo category

## Gợi ý chấm điểm
- Backend: đủ CRUD + validate + filter/search
- Frontend: đủ form, danh sách, detail, edit, delete
- Integration: frontend gọi backend hoạt động end-to-end

export default function ProductList({ products, onDelete, onViewDetail, onEdit }) {
  if (!products.length) {
    return <div className="card">Không có sản phẩm nào.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="card product-card" key={product.id}>
          <img src={product.image} alt={product.name} className="product-image" />
          <h3>{product.name}</h3>
          <p><strong>Giá:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <div className="card-actions">
            <button onClick={() => onViewDetail(product.id)}>Chi tiết</button>
            <button className="secondary" onClick={() => onEdit(product)}>Sửa</button>
            <button className="danger" onClick={() => onDelete(product.id)}>Xóa</button>
          </div>
        </div>
      ))}
    </div>
  );
}

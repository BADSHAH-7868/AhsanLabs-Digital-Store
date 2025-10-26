import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function ProductEditor() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleChange = (index: number, key: keyof Product, value: any) => {
    const updated = [...products];
    updated[index][key] = value;
    setProducts(updated);
  };

  const saveProducts = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    });
    alert('Products updated!');
  };

  return (
    <div>
      {products.map((p, i) => (
        <div key={p.id} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10 }}>
          <input
            value={p.name}
            onChange={e => handleChange(i, 'name', e.target.value)}
            placeholder="Name"
          />
          <input
            type="number"
            value={p.price}
            onChange={e => handleChange(i, 'price', Number(e.target.value))}
            placeholder="Price"
          />
          <input
            value={p.description}
            onChange={e => handleChange(i, 'description', e.target.value)}
            placeholder="Description"
          />
        </div>
      ))}
      <button onClick={saveProducts}>Save Changes</button>
    </div>
  );
}

import React from 'react';

const TopProducts = () => {
  const products = [
    { id: 1, name: 'Web Development', popularity: 85, sales: '48%' },
    { id: 2, name: 'Mobile App Development', popularity: 72, sales: '35%' },
    { id: 3, name: 'Cloud Solutions', popularity: 65, sales: '28%' },
    { id: 4, name: 'UI/UX Design', popularity: 58, sales: '22%' },
    { id: 5, name: 'SEO Optimization', popularity: 45, sales: '15%' }
  ];

  return (
    <div className="dashboard-card-modern">
      <div className="card-header-modern">
        <h3>Top Products</h3>
        <button className="btn-link">View All</button>
      </div>
      
      <div className="top-products-table">
        <div className="table-header-row">
          <div>#</div>
          <div>NAME</div>
          <div>POPULARITY</div>
          <div>SALES</div>
        </div>

        {products.map((product, index) => (
          <div key={product.id} className="product-row">
            <div className="col-number">{String(index + 1).padStart(2, '0')}</div>
            <div className="col-name">{product.name}</div>
            <div className="col-popularity">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${product.popularity}%` }}
                ></div>
              </div>
            </div>
            <div className="col-sales">{product.sales}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
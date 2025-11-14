import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const handleAffiliateClick = (e) => {
    e.preventDefault();
    window.open(product.affiliateLink, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]?.url || '/api/placeholder/300/300'}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.source}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition duration-150">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAffiliateClick}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Buy Now
          </button>
        </div>
        
        <Link
          to={`/product/${product._id}`}
          className="block text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-3"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
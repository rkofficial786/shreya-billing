import React from 'react';

const SearchResultsDropdown = ({ results, onAddProduct }) => {
  return (
    <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-64 overflow-y-auto">
      {results.map((product) => (
        <div
          key={product.id}
          className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-100"
          onClick={() => onAddProduct(product)}
        >
          <div>
            <div className="font-medium">{product.code}</div>
            <div className="text-sm text-gray-600">{product.name}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">₹{product.price.toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsDropdown;
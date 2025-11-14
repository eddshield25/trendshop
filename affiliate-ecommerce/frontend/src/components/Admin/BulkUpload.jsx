import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

const BulkUpload = () => {
  const [csvData, setCsvData] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const templateColumns = [
    'title',
    'description', 
    'price',
    'originalPrice',
    'affiliateLink',
    'source',
    'category',
    'tags'
  ];

  const downloadTemplate = () => {
    const csvContent = templateColumns.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!csvData.trim()) {
      toast.error('Please paste CSV data');
      return;
    }

    setIsUploading(true);
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const products = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const product = {};
        
        headers.forEach((header, index) => {
          if (values[index]) {
            product[header] = values[index];
          }
        });

        // Convert price fields to numbers
        if (product.price) product.price = parseFloat(product.price);
        if (product.originalPrice) product.originalPrice = parseFloat(product.originalPrice);
        
        // Convert tags string to array
        if (product.tags) {
          product.tags = product.tags.split(';').map(tag => tag.trim());
        }

        products.push(product);
      }

      await axios.post('/api/products/bulk-upload', { products });
      toast.success(`Successfully uploaded ${products.length} products`);
      setCsvData('');
    } catch (error) {
      toast.error('Error uploading products: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bulk Product Upload</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">CSV Template</h3>
            </div>
            <p className="text-blue-700 mb-4">
              Download the template and fill in your product data. Upload the completed CSV file below.
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Upload className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">Quick Tips</h3>
            </div>
            <ul className="text-green-700 list-disc list-inside space-y-1">
              <li>Include all required fields</li>
              <li>Price should be numbers only</li>
              <li>Separate tags with semicolons</li>
              <li>Source: tiktok, amazon, or other</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste CSV Data
          </label>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            rows={15}
            className="w-full border border-gray-300 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`title,description,price,originalPrice,affiliateLink,source,category,tags\n"Product Title","Product description",29.99,39.99,"https://affiliate-link.com","tiktok","Electronics","tag1;tag2"`}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          <Upload className="h-5 w-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Products'}
        </button>
      </div>
    </div>
  );
};

export default BulkUpload;
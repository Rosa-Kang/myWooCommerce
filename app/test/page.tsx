'use client';

import { useState, useEffect } from 'react';
import { woocommerce, wordpress, helpers, Product, StoreInfo } from '@/lib/woocommerce';

export default function TestPage() {
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    testAPIs();
  }, []);

  const testAPIs = async () => {
    setLoading(true);
    setErrors([]);
    const errorList: string[] = [];

    try {
      const connectionResult = await wordpress.testConnection();
      setConnectionTest(connectionResult);
    } catch (error) {
      errorList.push('WordPress connection failed');
    }

    try {
      const storeResult = await wordpress.getStoreInfo();
      setStoreInfo(storeResult);
    } catch (error) {
      errorList.push('Store info failed');
    }

    try {
      const productsResult = await woocommerce.getProducts({ per_page: 5 });
      setProducts(productsResult);
    } catch (error) {
      errorList.push('WooCommerce products failed');
    }

    setErrors(errorList);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing API connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">API Test Dashboard</h1>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h2 className="font-semibold text-red-800 mb-2">Errors ({errors.length})</h2>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {errors.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <p className="font-semibold text-green-800">All connections successful</p>
            </div>
          )}

          <button
            onClick={testAPIs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Re-test
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">WordPress Connection</h2>
          {connectionTest ? (
            <div className="text-sm space-y-1">
              <p>Status: Connected</p>
              <p>WordPress: {connectionTest.wordpress_version}</p>
              <p>WooCommerce: {connectionTest.woocommerce_version}</p>
            </div>
          ) : (
            <p className="text-red-600 text-sm">Connection failed</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Store Information</h2>
          {storeInfo ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>Name: {storeInfo.name}</p>
                <p>Currency: {storeInfo.currency}</p>
              </div>
              <div>
                <p>Country: {storeInfo.country}</p>
                <p>Timezone: {storeInfo.timezone}</p>
              </div>
            </div>
          ) : (
            <p className="text-red-600 text-sm">Failed to load</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Products ({products.length})</h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded p-4">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0].src}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Price: {helpers.formatPrice(product.price)}</p>
                    <p>Stock: {helpers.getStockStatusText(product)}</p>
                    {helpers.isOnSale(product) && (
                      <p className="text-red-600">
                        Sale: {helpers.getSalePercentage(product.regular_price, product.sale_price)}% off
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No products found</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-3">Environment</h2>
          <div className="bg-gray-50 p-4 rounded text-sm">
            <p>WordPress URL: {process.env.NEXT_PUBLIC_WORDPRESS_URL}</p>
            <p>Currency: {process.env.NEXT_PUBLIC_STORE_CURRENCY}</p>
            <p>Consumer Key: {process.env.WC_CONSUMER_KEY ? 'Set' : 'Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
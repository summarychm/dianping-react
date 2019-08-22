export default {
  getProductList: (path, rowIndex, pageSize) => `/mocks/products/${path}.json?rowIndex=${rowIndex}&pageSize=${pageSize}`,
  getProductDetail: (id) => `/mocks/product_detail/${id}.json`,
  getShopById: (id) => `/mocks/shops/${id}.json`,
  getPopularKeywords: () => '/mocks/keywords/popular.json',
  getRelatedKeywords: (text) => `/mocks/keywords/related.json?keyword=${text}` ,
  getRelatedShops: (keyword) => `/mocks/shops/related.json?keyword=${keyword}` ,
  getOrders: () => `/mocks/orders/orders.json`, 
}
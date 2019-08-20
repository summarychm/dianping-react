export default {
  getProductList: (path, rowIndex, pageSize) => `/mocks/products/${path}.json?rowIndex=${rowIndex}&pageSize=${pageSize}`,
  getProductDetail: (id) => `/mocks/product_detail/${id}.json`,
  getShopById: (id) => `/mocks/shops/${id}.json`
}
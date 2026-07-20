// Components
export { ProductsTable } from "./components/ProductsTable";
export { ProductForm } from "./components/ProductForm";
export { ProductFilters } from "./components/ProductFilters";
export { ProductStatusBadge } from "./components/ProductStatusBadge";
export { ProductBooleanToggle } from "./components/ProductBooleanToggle";
export { DeleteProductDialog } from "./components/DeleteProductDialog";
export { EmptyProductsState } from "./components/EmptyProductsState";
export { ProductsSkeleton } from "./components/ProductsSkeleton";
export { ProductFormMedia } from "./components/ProductFormMedia";

// Queries & Actions
export { getProducts, getProductById, isProductSlugTaken } from "./queries";
export {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleFeaturedAction,
  toggleActiveAction,
  toggleNewArrivalAction,
  togglePopularAction,
} from "./actions";

// Schema & Types
export {
  productInputSchema,
  productSchema,
  type ProductFormData,
  type ProductOutput,
} from "./schema";
export type {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductStatus,
  ProductPaginatedResult,
} from "./types";

// Constants
export { DEFAULT_PRODUCT_FILTERS, PRODUCT_CATEGORIES } from "./constants";

import data from "./dashboard/dataSlice";
import products from "./products/productSlice";
import users from "./users/usersSlice";
import plans from "./plans/planSlice";
import topproducts from "./sales/topProductSlice";
import topstores from "./sales/topStoreSlice";
import nexus from "./nexus/nexusSlice";
import amazon from "./amazon/amazonSlice";
import theme from "./theme/themeSlice";

const rootReducer = {
  data,
  theme,
  products,
  topproducts,
  topstores,
  users,
  nexus,
  amazon,
  plans,
};

export default rootReducer;

import data from "./dashboard/dataSlice";
import products from "./products/productSlice";
import users from "./users/usersSlice";
import plans from "./plans/planSlice";
import topproducts from "./sales/topProductSlice";
import topstores from "./sales/topStoreSlice";
import nexus from "./nexus/nexusSlice";
import theme from "./theme/themeSlice";

const rootReducer = {
  theme,
  data,
  products,
  topproducts,
  topstores,
  nexus,
  users,
  plans,
};

export default rootReducer;

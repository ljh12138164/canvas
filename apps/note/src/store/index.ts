import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

const pinia = createPinia().use(piniaPersist);

export default pinia;

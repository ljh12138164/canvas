import { createPinia } from "pinia";
// @ts-ignore
import piniaPersist from "pinia-plugin-persist";

const pinia = createPinia().use(piniaPersist);

export default pinia;

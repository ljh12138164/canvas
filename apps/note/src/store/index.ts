import { createPinia } from 'pinia';
// @ts-expect-error pinia-plugin-persist is not typed
import piniaPersist from 'pinia-plugin-persist';

const pinia = createPinia().use(piniaPersist);

export default pinia;

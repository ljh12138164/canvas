// import { createHmac } from 'crypto';
// import { Doc } from 'yjs';
// import { to } from 'await-to-js';
// import axios from 'axios';
// import * as Y from 'yjs';
// export enum Events {
//   onChange = 'change',
//   onConnect = 'connect',
//   onCreate = 'create',
//   onDisconnect = 'disconnect',
// }

// export interface Configuration {
//   debounce: number | false | null;
//   debounceMaxWait: number;
//   secret: string;
//   transformer: {
//     toYdoc: (document: any) => Doc;
//     fromYdoc: (document: Doc) => any;
//   };
//   url: string;
//   events: Array<Events>;
// }
// const doc = new Y.Doc();
// export class Webhook {
//   configuration: Configuration = {
//     debounce: 2000,
//     debounceMaxWait: 10000,
//     transformer: {
//       toYdoc: () => doc,
//       fromYdoc: (document: Doc) => document,
//     },
//     secret: '459824aaffa928e05f5b1caec411ae5f111',
//     url: 'https://ljhboard.cn/api/design/webhook/save',
//     events: [Events.onChange],
//   };

//   debounced: Map<string, { timeout: NodeJS.Timeout; start: number }> =
//     new Map();

//   /**
//    * Constructor
//    */
//   constructor(configuration?: Partial<Configuration>) {
//     this.configuration = {
//       ...this.configuration,
//       ...configuration,
//     };

//     if (!this.configuration.url) {
//       throw new Error('url is required!');
//     }
//   }

//   /**
//    * Create a signature for the response body
//    */
//   createSignature(body: string): string {
//     const hmac = createHmac('sha256', this.configuration.secret);

//     return `sha256=${hmac.update(body).digest('hex')}`;
//   }

//   /**
//    * debounce the given function, using the given identifier
//    */
//   debounce(id: string, func: Function) {
//     const old = this.debounced.get(id);
//     const start = old?.start || Date.now();

//     const run = () => {
//       this.debounced.delete(id);
//       func();
//     };

//     if (old?.timeout) clearTimeout(old.timeout);
//     if (Date.now() - start >= this.configuration.debounceMaxWait) return run();

//     this.debounced.set(id, {
//       start,
//       timeout: setTimeout(run, <number>this.configuration.debounce),
//     });
//   }

//   /**
//    * Send a request to the given url containing the given data
//    */
//   async sendRequest(event: Events, payload: any) {
//     const json = JSON.stringify({ event, payload });

//     return axios.post(this.configuration.url, json, {
//       headers: {
//         'X-Hocuspocus-Signature-256': this.createSignature(json),
//         'Content-Type': 'application/json',
//       },
//     });
//   }

//   /**
//    * onChange hook
//    */
//   async onChange(data: any) {
//     if (!this.configuration.events.includes(Events.onChange)) {
//       return;
//     }

//     const save = async () => {
//       const [err] = await to(
//         this.sendRequest(Events.onChange, {
//           document: this.configuration.transformer.fromYdoc(data.document),
//           documentName: data.documentName,
//           context: data.context,
//           requestHeaders: data.requestHeaders,
//           requestParameters: Object.fromEntries(
//             data.requestParameters.entries()
//           ),
//         })
//       );
//       if (err) {
//         console.error(`Caught error in extension-webhook: ${err}`);
//       }
//     };

//     if (!this.configuration.debounce) {
//       return save();
//     }

//     this.debounce(data.documentName, save);
//   }

//   /**
//    * onLoadDocument hook
//    */
//   async onLoadDocument(data: any) {
//     if (!this.configuration.events.includes(Events.onCreate)) {
//       return;
//     }

//     const [err, res] = await to(
//       this.sendRequest(Events.onCreate, {
//         documentName: data.documentName,
//         requestHeaders: data.requestHeaders,
//         requestParameters: Object.fromEntries(data.requestParameters.entries()),
//       })
//     );
//     if (err) {
//       console.error(`Caught error in extension-webhook: ${err}`);
//     }

//     if (res?.status !== 200 || !res?.data) return;

//     const document =
//       typeof res?.data === 'string' ? JSON.parse(res?.data) : res?.data;

//     for (const fieldName in document) {
//       if (data.document.isEmpty(fieldName)) {
//         data.document.merge(
//           this.configuration.transformer.toYdoc(document[fieldName])
//         );
//       }
//     }
//   }

//   /**
//    * onConnect hook
//    */
//   async onConnect(data: any) {
//     if (!this.configuration.events.includes(Events.onConnect)) {
//       return;
//     }

//     const [err, res] = await to(
//       this.sendRequest(Events.onConnect, {
//         documentName: data.documentName,
//         requestHeaders: data.requestHeaders,
//         requestParameters: Object.fromEntries(data.requestParameters.entries()),
//       })
//     );
//     if (err) {
//       console.error(`Caught error in extension-webhook: ${err}`);
//     }
//     return typeof res?.data === 'string' && res?.data.length > 0
//       ? JSON.parse(res?.data)
//       : res?.data;
//   }

//   async onDisconnect(data: any) {
//     if (!this.configuration.events.includes(Events.onDisconnect)) {
//       return;
//     }

//     const [err] = await to(
//       this.sendRequest(Events.onDisconnect, {
//         documentName: data.documentName,
//         requestHeaders: data.requestHeaders,
//         requestParameters: Object.fromEntries(data.requestParameters.entries()),
//         context: data.context,
//       })
//     );
//     if (err) {
//       console.error(`Caught error in extension-webhook: ${err}`);
//     }
//   }
// }

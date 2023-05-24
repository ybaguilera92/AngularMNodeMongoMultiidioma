// export default fn => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

import I18n from "../node_modules/i18n/i18n.js"
import path from "path";
const i18n = new I18n({
  locales: ['en', 'uk', 'es'],
  defaultLocale: 'es',
  directory: path.join('./', 'locales')
});

export default i18n;

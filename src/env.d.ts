// declare module "*.component.css" {
//   const result: any;
//   export default result;
// }
// declare module "*.css" {
//   const result: void;
//   export default result;
// }

interface Window {
  plausible: ((eventName: string, eventData: any) => void) & { q: any };
}

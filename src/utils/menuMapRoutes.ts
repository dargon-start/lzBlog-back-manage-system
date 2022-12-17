import {useStore} from "@/store/index";
const Store = useStore();
//扁平化menu
export function flatMenu() {
  let breadList: any[] = [];
  const crumbItems = Store.menuItems;
  crumbItems.forEach((item) => {
    if (item.children) {
      item.children.forEach((ch) => {
        breadList.push(ch);
      });
    } else {
      breadList.push(item);
    }
  });
  return breadList;
}
export function routeMapBreadcrumb(name: string) {
  const breadList = flatMenu();
  const currentBread = breadList.filter((item) => item.routeName == name);
  console.log(currentBread);

  return currentBread[0].breadCrumb;
}

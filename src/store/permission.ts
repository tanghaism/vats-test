import { defineStore, StoreGetters } from 'pinia';
import { defineComponent } from 'vue';
import { RouteMeta, RouteRecordRaw } from 'vue-router';
import route, { routeMap } from '@/router/index';

export interface IGroup {
  name: string;
  path: string;
  meta: RouteMeta;
  children: IGroup[];
  [props: string]: unknown;
}

export type IPermissionState = {
  permissionMap: Record<string, boolean>;
  menu: IGroup[];
};

export type IPermissionActions = {
  setPermissionMap(permissionData: string[]): void;
  setMenu(menuData: unknown[]): void;
  getPermission(): Promise<void>;
};

// 组装服务端下发的路由和菜单
function loopTree(treeArray: any[], routeMap: any, menu: IGroup[] = [], parent?: IGroup): IGroup[] {
  for (const item of treeArray) {
    // 如果当前权限点有权限标示，则表示是菜单（路由）
    if (item.permission_id) {
      // 获取路由对象
      const routeMenu = (routeMap as any)[item.permission_id] as RouteRecordRaw;
      // 如果存在路由,且需要展示在菜单中，则向菜单数组添加
      if (routeMenu) {
        // 从对象中删除已经找到的路由对象，未匹配到的路由则为403
        delete (routeMap as any)[item.permission_id];
        (routeMenu.meta as RouteMeta).icon = item.icon || 'iconfont icon-file';
        (routeMenu.meta as RouteMeta).title = item.name;
        (routeMenu.meta as RouteMeta).breadcrumb = [
          {
            name: routeMenu.name as string,
            path: routeMenu.path,
            breadcrumbName: (routeMenu.meta as RouteMeta).title,
          },
        ];
        if (parent) {
          ((routeMenu.meta as RouteMeta).breadcrumb as any).unshift({
            name: (parent as IGroup).name,
            path: (parent as IGroup).path,
            breadcrumbName: (parent as IGroup).meta.title,
          });
        }
        route.addRoute('Index', routeMenu);
        if (!routeMenu.meta?.hideMenu) {
          menu.push(routeMenu as unknown as IGroup);
        }
      }
    } else {
      // 如果当前权限点没有权限标示，则表示是分组
      if (item.children?.length > 0) {
        if ((routeMap as any)[item.children[0].permission_id]) {
          const group: IGroup = {
            path: `/${item.id.toString()}`,
            name: item.id.toString(),
            redirect: (routeMap as any)[item.children[0].permission_id].path,
            children: [],
            meta: {
              icon: item.icon || 'iconfont icon-file',
              title: item.name,
            },
            component: defineComponent({
              name: item.id.toString(),
              template: `<div></div>`,
            }),
          };
          const childData = loopTree(item.children || [], routeMap, [], group);
          route.addRoute('Index', group as any);
          menu.push({ ...group, children: childData });
        } else {
          window.$modal.info({
            title: '路由权限点未完善',
          });
        }
      }
    }
  }

  return menu;
}

export const usePermission = defineStore<
  string,
  IPermissionState,
  StoreGetters<unknown>,
  IPermissionActions
>('permission', {
  state() {
    return {
      permissionMap: {},
      menu: [],
    };
  },
  actions: {
    // 组装权限点
    setPermissionMap(permissionData) {
      const permission: IPermissionState['permissionMap'] = {};
      permissionData.forEach(key => {
        permission[key] = true;
      });
      this.permissionMap = {
        ...permission,
      };
    },
    // 组装侧边栏导航
    setMenu(menuData) {
      const _routeMap = { ...routeMap };
      const menu = loopTree(menuData || [], _routeMap, []);
      Object.keys(_routeMap).forEach((key: string) => {
        if (key !== 'child') {
          ((_routeMap as any)[key].meta as RouteMeta).title = '暂无权限';
          route.addRoute('Index', (_routeMap as any)[key]);
        }
      });
      this.menu = menu;
    },
    // 通过接口获取权限
    async getPermission() {
      this.setMenu([
        {
          permission_id: 'dashboard',
          name: '控制面板',
        },
      ]);
    },
  },
});

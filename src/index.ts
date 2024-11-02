import { CompElem, decorator, Decorator, DecoratorType } from "compelem";
import CRUD, { _add2Cruds, _newCruds, _onHook, crudError, RestUrl } from "cruda";
import { closest, noop, size, values } from "myfx";

const CrudComponentMap = new WeakMap<CompElem, Record<string, CRUD>>();

/**
 * 装饰crud实例注解
 * @example
 *  @crud('/api/xxx') / @crud({url:'/api/xxx',...})
 *  crud:CRUD //crud的getter
 * @param url cruda实例的服务地址
 */
class CrudDecorator extends Decorator {
  created(component: CompElem, classProto: CompElem, fieldName: string, ...args: any[]) {
  }
  mounted(component: CompElem, setReactive: (key: string, value: any) => any, ...args: any[]) {
  }
  updated(component: CompElem, changed: Record<string, any>) {
  }
  get targets(): DecoratorType[] {
    return [DecoratorType.FIELD]
  }
  restURL: string | RestUrl
  constructor(restURL: string | RestUrl) {
    super();
    this.restURL = restURL
  }

  propsReady(instance: CompElem, setReactive: (key: string, value: any) => any, classProto: CompElem, fieldName: string, ...args: any[]) {
    let url = this.restURL
    let crudMap: Record<string, CRUD> | undefined = CrudComponentMap.get(instance)
    let crud
    if (!crudMap) {
      const cruds = _newCruds({ [fieldName]: url }, instance)
      crud = cruds[fieldName]
      crudMap = {}
      CrudComponentMap.set(instance, crudMap)
    } else {
      crud = _add2Cruds(fieldName, url, instance)
    }
    crud = setReactive(fieldName, crud)
    crudMap[fieldName] = crud

    Object.defineProperty(instance, fieldName, {
      get() {
        return crudMap![fieldName];
      }
    })
  }
}

export const crud = decorator<ConstructorParameters<typeof CrudDecorator>>(CrudDecorator)

/**
 * 用于注册钩子，在mounted之后的回调中启用
 * @param {string} hookName 钩子名称
 * @param {Function} hook 回调函数
 * @returns 移除钩子的函数
 */
export function onHook(
  comp: CompElem,
  hookName: string,
  hook: (crud: CRUD, ...args: any[]) => void
): () => void {
  let crudVM = closest(
    comp,
    (node: Record<any, any>) => !!node.__crud_nid_,
    "parentComponent"
  );
  if (!crudVM) return noop;
  return _onHook(crudVM.__crud_nid_, hookName, hook, comp);
}

/**
 * 用于自定义组件向上查找最近的$crud并返回。用于自定义组件封装crud逻辑
 * @param {CompElem} 开始查找的组件
 * @param {string} crudName 需要查找的crud属性名
 * @return {CRUD | null} $crud 向上查找最近的crud实例或null
 */
export function lookUpCrud(comp: CompElem, crudName: string): CRUD | null {
  let cruds: Record<string, CRUD> | undefined
  let crudVM = closest(
    comp,
    (node: CompElem) => !!(cruds = CrudComponentMap.get(node)),
    "parentComponent"
  );
  if (!crudVM) return crudVM;

  if (size(cruds) > 1) {
    if (!crudName) {
      crudError(`Must specify 'crudName' when multiple instances detected`);
      return null;
    }
    return cruds![crudName]
  }

  return values(cruds)[0];
}
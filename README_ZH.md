# cruda-compelem

Cruda compelem 相关 UI 适配器。

## 使用

### 1. 安装

```ts
// 安装CRUD
import request from "axios";
import CRUD from "cruda-compelem";
// 通常request总是会使用封装后的axios实例
CRUD.request = request;
```

### 2. 激活

```ts
class Xx extends CompElem {
  ...
  @crud("/api/single")
  crud: CRUD;
  ...
}
```

通过对象方式激活 CRUD 时，可以传递除 url 及其他内置属性 外的其他自定义参数。比如

```ts
class Xx extends CompElem {
  ...
  @crud({ url: "auth/users", permission: "a_b_c" })
  crud: CRUD;
  ...
}
```

> 其他内置属性包括
>
> - query
> - restApi
> - autoResponse

之后可通过 VM 属性`params`(read only)来获取激活参数

```js
this.crud.params.permission;
```

params 参数在创建自定义 CRUD 组件时非常有用，比如通过 permission 参数可以实现组件自动权限管理，控制组件视图展示

### 3. 多实例

```ts
class Xx extends CompElem {
  ...
  @crud("/api/single")
  crud: CRUD;

  @crud("/api/multiple")
  crud2: CRUD;
  ...
}
```

### 4. HOOK

```ts
class Xx extends CompElem {
  ...
  @crud("/api/single")
  crud: CRUD;
  ...

  constructor() {
    super();
    //也可以写在其他生命周期钩子中
    onHook(this, CRUD.HOOK.BEFORE_QUERY, (c: CRUD, rs) => {
      console.log(rs, 'onHook')
    })
  }
}
```

### 5. 自定义组件

```ts
class Xx extends CompElem {
  crud: CRUD;
  mounted() {
    this.crud = lookUpCrud(this, "crud2");
  }
}
```

### 6. URL 参数

同

## 可导出

```js
import CRUD,{...} from 'cruda-compelem'
```

- CRUD
  > crud 命名空间，可设置全局默认值、调用钩子等
- lookUpCrud(vm,crudName?) : CRUD | null
  > 向上查找最近的 crud 实例
- onHook(vm,hookName,hook) : ()=>void
  > 添加一个额外钩子，返回取消函数

## Cruda

CRUD 相关 API 请前往[Cruda](https://github.com/holyhigh2/cruda)

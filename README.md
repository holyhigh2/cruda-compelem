# cruda-compelem

A Cruda adapter for compelem.

## Usage

### 1. Install

```js
// Usually init cruda in main.js
import request from "axios";
import CRUD from "cruda-compelem";
// set requester
CRUD.request = request;
```

### 2. Activate

```ts
class Xx extends CompElem {
  ...
  @crud("/api/single")
  crud: CRUD;
  ...
}
```

You can pass custom parameters to Cruda besides the URL when you activate it in object form. Such as below

```ts
class Xx extends CompElem {
  ...
  @crud({ url: "auth/users", permission: "a_b_c" })
  crud: CRUD;
  ...
}
```

then you can read it via `params`

```js
this.crud.params.permission;
```

### 3. Multi-instance

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

### 4. HOOKs

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

### 5. CRUD component

```ts
class Xx extends CompElem {
  crud: CRUD;
  mounted() {
    this.crud = lookUpCrud(this, "crud2");
  }
}
```

### 6. URL params

Same as others

## Exportable

```js
import CRUD,{...} from 'cruda-compelem'
```

- CRUD
  > crud namespace, can bind global defaults, hooks
- lookUpCrud(vm, crudName?) : CRUD | null
  > look up the nearest crud instance then return
- onHook(vm,hookName,hook) : ()=>void
  > add an extra hook

## Cruda

CRUD API please to [Cruda](https://github.com/holyhigh2/cruda)

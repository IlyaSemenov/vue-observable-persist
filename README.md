# vue-observable-persist

Automatically persists a Vue observable object using localStorage (or compatible API).

## Instalation

```bash
yarn add vue-observable-persist
```

## Usage

```ts
import Vue from "vue"
import persist from "vue-observable-persist"

import { User } from "~/types/User"

class Store {
	user: User = null

	async login() {
		// this.user = await axios.get(...)
	}
}

const store = Vue.observable(new Store())

persist(store)

export default store
```

## Options

If not explicitly overriden, the following defauts are used:

```ts
persist(store, {
	storage: localStorage,
	key: "store",
	serialize: JSON.stringify,
	deserialize: JSON.parse,
})
```

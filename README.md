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
		this.user = await axios.get("/user")
	}
}

export const store = persist(Vue.observable(new Store()))
```

## Options

If not explicitly overriden, the following defauts are used:

```ts
persist(store, {
	storage: localStorage,
	key: "store",
	fields: undefined, // pass array to save/load only certain keys: ["user", "token"]
	serialize: JSON.stringify,
	deserialize: JSON.parse,
})
```

## Persisting existing (or imported) objects

```ts
const store = Vue.observable(new Store())

// store is converted to be persistent in place
persist(store)
```

## Persisting Vue objects

```ts
import persist from "vue-observable-persist"
import { Component, Vue } from "vue-property-decorator"

import { User } from "~/types/User"

@Component
export class Store extends Vue {
	user: User = null

	async login() {
		this.user = await axios.get("/user")
		this.$emit("logged", this.user)
	}
}

export const store = persist(new Store())
```

NOTE: Nested Vue objects are currently not supported.

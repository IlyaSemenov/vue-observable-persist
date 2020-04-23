import { merge } from "lodash"
import Vue from "vue"

interface Options {
	storage: Storage
	key: string
	serialize: (data: any) => any
	deserialize: (data: any) => any
}

const defaults: Options = {
	storage: localStorage,
	key: "store",
	serialize: JSON.stringify,
	deserialize: JSON.parse,
}

export default function persist<T>(store: T, opts?: Partial<Options>): T {
	const options: Options = { ...defaults, ...opts }

	const raw_data = options.storage.getItem(options.key)
	let data
	try {
		data = options.deserialize(raw_data)
	} catch (err) {}
	merge(store, data)

	// Support Vue objects and plain observable objects
	const store_data = (store as any).$data || store

	const watcher = new Vue({
		computed: {
			data: () => store_data,
		},
	})
	watcher.$watch(
		"data",
		data => options.storage.setItem(options.key, options.serialize(data)),
		{ deep: true },
	)

	return store
}

import { merge, pick } from "lodash"
import Vue from "vue"

interface Options {
	storage?: Pick<Storage, "getItem" | "setItem">
	key: string
	fields?: string[]
	serialize: (data: any) => any
	deserialize: (data: any) => any
}

const defaults: Options = {
	key: "store",
	serialize: JSON.stringify,
	deserialize: JSON.parse,
}

export default function persist<T>(store: T, opts?: Partial<Options>): T {
	const options: Options = { ...defaults, ...opts }

	// In some environments there is no localStorage at all.
	// If we provided localStorage in defaults, it would crash.
	const storage = options.storage || localStorage

	const filter_data = (data: T) =>
		options.fields ? pick(data, options.fields) : data

	try {
		merge(store, filter_data(options.deserialize(storage.getItem(options.key))))
	} catch (err) {}

	// Support Vue objects and plain observable objects
	const store_data = (store as any).$data || store

	const watcher = new Vue({
		computed: {
			data: () => store_data,
		},
	})
	watcher.$watch(
		"data",
		data => storage.setItem(options.key, options.serialize(filter_data(data))),
		{ deep: true },
	)

	return store
}

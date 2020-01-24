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

	const watcher = new Vue({
		computed: {
			store: () => store,
		},
	})
	watcher.$watch(
		"store",
		function() {
			options.storage.setItem(options.key, options.serialize(store))
		},
		{ deep: true },
	)

	return store
}

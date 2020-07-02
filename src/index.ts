import { merge, pick } from "lodash"
import Vue from "vue"

interface Options {
	storage: Pick<Storage, "getItem" | "setItem">
	key: string
	fields?: string[]
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

	const filter_data = (data: T) =>
		options.fields ? pick(data, options.fields) : data

	try {
		merge(
			store,
			filter_data(options.deserialize(options.storage.getItem(options.key))),
		)
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
		data =>
			options.storage.setItem(
				options.key,
				options.serialize(filter_data(data)),
			),
		{ deep: true },
	)

	return store
}

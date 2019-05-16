module.exports = function (api) {
	api.cache.using(() => process.env.NODE_ENV === "development");
	
	const presets = [
		["@babel/preset-env", {
			"targets": { node: 'current' }
		}],
		"@babel/preset-typescript",
		"@babel/preset-react"
	];
	const plugins = [
		"@babel/proposal-class-properties",
		"@babel/proposal-object-rest-spread",

	];

	if (api.env() == 'development') {
		plugins.push("react-hot-loader/babel")
	}
	return {
		presets,
		plugins
	};
}

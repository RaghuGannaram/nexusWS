function hideSensitiveInfo(data, ...sensitiveInfo) {
	let clone = {};
	for (let key of Object.keys(data)) {
		if (!sensitiveInfo.includes(key)) {
			clone[key] = data[key];
		}
	}
	return clone;
}

module.exports = hideSensitiveInfo;

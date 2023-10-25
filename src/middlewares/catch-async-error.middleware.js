function catchAsyncError(routeHandler) {
	return function (req, res, next) {
		return Promise.resolve(routeHandler(req, res, next)).catch(next);
	};
}

module.exports = catchAsyncError;

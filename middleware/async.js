// template pre try cach
// asynchronne chyby
//FIXME: nefunguje - v POST ak je DB vypnuta nevyhodi chyby po 30 sekundach

module.exports = function (handler) {
	// handler argument bude async funkcia preto sa musi returtnu
	// aby bool pristup k res, req a next
	return async (req, res, next) => {
		//? pouzit vzdy try-catch ked pouzivame async-await
		try {
			await handler(req, res);
		} catch (error) {
			// zavolame next na funkcuu v index.js error je prvy argument v funkcii
			next(error);
		}
	};
};

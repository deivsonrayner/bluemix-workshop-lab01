module.exports = function bindWatsonTraslator(app) {
	var //modules
		cfenv = require("cfenv"),
		util = require('util'),
		watson = require('watson-developer-cloud/language-translator/v2')
,

		// variables
		appEnv = cfenv.getAppEnv(),
		credentials = appEnv.getServiceCreds('watson'),
		language_translator = new watson ({
  			username: credentials.username,
  			password: credentials.password
		})
	;
	
	app.models.Item.observe('before save', function translate(ctx, next) {
		if (!ctx.isNewInstance) {
			next();
			return;
		}
		
		language_translator.identify({
			text: ctx.instance.text },
			function (err, language) {
				if (err) {
					next();
				} else {
					language_translator.translate({
							text: ctx.instance.text, 
							source : language.languages[0].language, 
							target: 'en' 
						},
						function (err, translation) {
							if (err) {
								next();
							} else {
								ctx.instance.text = translation.translations[0].translation;
								next();
							}
						}
					);
				}
		});
	});
};

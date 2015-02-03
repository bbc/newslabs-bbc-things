var request = require('request'),
    cheerio = require('cheerio'),
    Q = require('q');

module.exports = (function() {

    this.search = function(text, exactMatchOnly) {        
        if (typeof text === 'string') {
            return searchSingle(text, exactMatchOnly);
        } else if (Object.prototype.toString.call(text) === '[object Array]') {
            return searchMultiple(text, exactMatchOnly);
        }
    };
            
    var searchSingle = function(text, exactMatchOnly) {
        var url = 'http://www.bbc.co.uk/things/search?q='+encodeURIComponent(text);
        return getUrl(url)
        .then(function(body) {
            var promises = [];
            if (body) {
                var $ = cheerio.load(body);
                $('li[class=search-results__result]').each(function(i, el) {
                    // Skip if label does match text and exactMatchOnly is set to true
                    if (exactMatchOnly === true &&
                        $('*[class=search-results__result__preferred-label]', el).text().toLowerCase() != text.toLowerCase())
                        return;

                    var thing = {
                        label: $('*[class=search-results__result__preferred-label]', el).text(),
                        hint: $('*[class=search-results__result__disambiguation-hint]', el).text(),
                        uri: $('*[class=search-results__result__uri]', el).text(),
                        properties: function() {
                            // @todo Cache responses                            
                            return getUrl(this.uri.replace(/#(.*)/, '')+".json")
                            .then(function(body) {
                                return JSON.parse(body).results[0];
                            });
                        }
                    };
                    promises.push(thing);
                });
            };
            return Q.all(promises);
        });
    };
    
    var searchMultiple = function(textArray, exactMatchOnly) {
        var deferred = Q.defer();
        var obj = {};
        Q.fcall(function() {
            var promises = [];
            textArray.forEach(function(text, i) {
                var promise = searchSingle(text, exactMatchOnly)
                .then(function(things) {
                    if (!things) {
                        obj[text] = [];
                        return [];
                    }
                
                    obj[text] = things;
                    return things;
               });
               promises.push(promise);
            });
            return Q.all(promises);
        })
        .then(function(promises) {
            deferred.resolve(obj);
        });
        return deferred.promise;
    };
    
    var getUrl = function(url, callback) {
        var deferred = Q.defer();
        request(url, function(error, response, body) {
            if (error || !body) {
                // @todo handle error
                deferred.resolve(null);
            } else {
                deferred.resolve(body);
            }
        });
        return deferred.promise;
    };
    
    return this;
    
})();
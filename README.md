# BBC Things

http://www.bbc.co.uk/things/

This is an unoffical client for the BBC Things Linked Data Platform.

You can pass a string (or an array of strings) and get back matching Things 
from a search query. You can then fetch extended properties for any Thing.

You might want to combine it with something like the npm module `gramophone` to
do entity extraction on bodies of text and find relevant Things to tag content 
with.

## Passing a string

```javascript
var BBCThings = require('bbc-things');
var text = "David Cameron";
BBCThings.search(text)
.then(function(things) {
    console.log(things);
});
```

### Example response object

```
[ { label: 'David Cameron',
    hint: 'Politician',
    uri: 'http://www.bbc.co.uk/things/ed9d1ef3-eded-4f81-b158-be49cfc1ea8f#id',
    properties: [Function] } ]

```

## Passing an array of strings

```javascript
var BBCThings = require('bbc-things');
var arrayOfStrings = ["Kenya", "Nairobi"];
BBCThings.search(arrayOfStrings)
.then(function(things) {
    console.log(things);
});
```

### Example response object

```
{ Kenya: 
   [ { label: 'Kenya',
       hint: 'Kenya',
       uri: 'http://www.bbc.co.uk/things/7d7c35fa-f724-4b36-90a0-21f71d99857d#id',
       properties: [Function] },
     { label: 'Jomo Kenyatta',
       hint: 'Politician',
       uri: 'http://www.bbc.co.uk/things/d760ca99-2b63-499e-9be5-8aab0b64ca6e#id',
       properties: [Function] },
     { label: 'Uhuru Kenyatta',
       hint: 'Kenyan politician.',
       uri: 'http://www.bbc.co.uk/things/f9e4f58f-cb89-46b6-ab75-e44e84229404#id',
       properties: [Function] } ],
  Nairobi: 
   [ { label: 'Nairobi',
       hint: 'Kenya',
       uri: 'http://www.bbc.co.uk/things/bfe2de9d-fde7-4781-89ca-1735ede10982#id',
       properties: [Function] } ] 
}
```

## Additional properties

You can access additional information by calling .properties() on a Thing.

The properties vary depending on the entity (e.g. places have lat/lon properties).

```javascript
var BBCThings = require('bbc-things');
BBCThings.search("Ed Miliband")
.then(function(things) {
    thing[0].properties()
    .then(function(properties) {
        console.log ( properties );        
    });
});
```

### Example .properties() response object

```
[ { label: 'Ed Miliband',
    hint: 'Politician',
    uri: 'http://www.bbc.co.uk/things/b13fa1f6-2799-404f-bfae-91632ec66b10#id',
    properties: [Function] } ]
{ '@id': 'http://www.bbc.co.uk/things/b13fa1f6-2799-404f-bfae-91632ec66b10#id',
  '@type': 
   [ 'owl:Thing',
     'ManagedThing',
     'Thing',
     'Person',
     'rdfs:Resource',
     'tagging:TagConcept',
     'tag:TagConcept' ],
  disambiguationHint: 'Politician',
  label: 'Ed Miliband',
  preferredLabel: 'Ed Miliband',
  primaryTopicOf: 
   [ 'http://en.wikipedia.org/wiki/Ed_Miliband',
     'http://news.bbc.co.uk/democracylive/hi/representatives/profiles/40791.stm',
     'http://www.edmiliband.org',
     'http://www.guardian.co.uk/politics/person/8711/' ],
  sameAs: 
   [ 'http://dbpedia.org/resource/Ed_Miliband',
     'http://rdf.freebase.com/ns/m.04qdjv',
     'http://www.wikidata.org/entity/Q216594' ] }
```

## Requesting exact matches only

If if you want to return Things who's labels are exact matches only (ignoring 
case sensitivity) then you can pass 'true' as the second parameter to instruct 
it to return 'exact matches only'.

For example, if you want to get the Thing for "Kenya", but were not interested
in the data for Kenyan Politican "Uhuru Kenyatta" returned you could do this:

```javascript
var BBCThings = require('bbc-things');
BBCThings.search("Kenya", true)
.then(function(things) {
    console.log(things);
});
```

### Contributions and thanks

This is a very simple library and is entirely unofficial and was not created by
the folks who've created the excellent BBC Things site which it uses.

It was created to make it easier to do experiments with linked data and to try 
out different approaches to entity extraction.

<div align="center">
    <img src="https://github.com/ceddl/ceddl-polyfill/raw/master/assets/logotext.png">
<br>
<br>
<h1>Version 0.9 Release 🎉</h1>
</div>


<div align="center">
  <p>
    Customer experience digital data layer polyfill. Bridging the gap between the ceddl spec's and the browsers
  </p>

</div>

<h2 align="center">Getting started</h2>

Install with npm:

```bash
npm install @ceddl/ceddl-polyfill
```

Html boilerplate:
```html
<!doctype html>
<html>
    <head>
        <title>CEDDL-polyfill - Bridging the gap between the spec and the browsers</title>
        <script src="node_modules/@ceddl/ceddl-polyfill/dist/index.min.js" ></script>
    </head>
    <body ceddl-observe="page" data-section="ceddl demo">
        <div>
            <!-- ... -->
        </div>
        <script async src="/demo.models.js"></script>
    </body>
</html>
```

Minimal ceddl model:
```js
var mf = ceddl.modelFactory;

    mf.create({
        key: 'page',
        root: 'true',
        fields: {
            section: {
                type: mf.fields.StringField,
                required: true
            }
        }
    });

    ceddl.initialize();
});
```

<h2 align="center">Introduction</h2>

Increasingly, multiple groups are involved in the data collection process for a given digital property, and each has a solution to be implemented on the page. Page design has become more complex and development cycles have lengthened. As a result when you look inside your Tag Manager chances are high that you see a chaos of different marketing tags. All your data is collected from different locations in your application. There is no order, integrity and consistency. No control and overview over events and data flows. Customer Experience Digital Data Layer ames to align your data into a single unidirectional data stream. To create a small(in browser) modular, independant and decoupled datalayer for improving web tracking, website personalization and DMP implementations.

The goals of this polyfill include:
* Expanding the accessibility, quality of dynamic data inside a DDL that may be supplied by the author
* Describing a HTML and javascript api for the browser and or polyfill
* Apply lessons learnt by implementations of Customer Experience Digital Data Layer 1.0

The schema to support this standard has been designed to be a minimal extention of DOM and Web API's.

Developer documentation, specification document and a website is on its way and can be expected online before end of November 2018.


<h2 align="center">development</h2>

#### Open ceddl development app
```
npm install
npm run dev
```

#### Run the unit testing
```
npm install
npm run test
```

<h2 align="center">Bennefits </h2>

#### Increased data quallity
While software vendors do an increasingly good job at processing Big Data, some errors are not always caught gracefully before they end up on a dashboard or report. The ability to catch data issue's before they end up on a live server can be invaluable to your business. ceddl-polyfill makes it possible to define the data structure you expect your site to produce. Just like defining a table in a database. It will validate the data stream in the development process and reporte while testing your analytics suite.

Having a unidirectional data stream means that all data in to your analytics follows the same lifecycle pattern, making the logic more predictable and easier to understand. It also encourages data normalization, so that you don't end up with multiple, independent copies of the same data that are unaware of one another.

#### Solves Timing issues
If you have some experience with web analytics you are likely to have encountered timing errors. A website loading is not static. It loads files, content and data depending on user input or api calls. If you look at it from this angle you could imagine a web page as a time line of events. Events have become a major part of ceddl. It makes it possible to listen for data, updating your analytics as soon as data is available.

#### Facilitate A/B testing and personalization
We use an EventBus that allows publish-subscribe-style communication between components without requiring the components to explicitly register with one another (and thus be aware of each other).


#### Easy data exchange between 3rd-party scripts
The EventBus enables 3rd-party scripts to communicate without a chance of creating errors while transferring the data. The eventbus makes it possible to upgrade 3rd-party scripts interdependently.

#### Cleaner code
Every marketing tool provides it's own API for events and data tracking. While actually all of this marketing tags require the same data, but in different format, ceddl-polyfill allows to collect customer data from attributes in your HTML or one Javascript API and send it to hundreds of tools for analytics, marketing and data warehousing. This means that you analytics can be operating without the need for tagging code inside every app module.

#### Vendor independent with easy migration path
Replace any third-party system to another or run A/B test between them? Vendor migration will take you no more than 5 minutes. No change on the site server is required since all data stream is done through a standardized data layer.

<h2 align="center">License</h2>

ceddl-polyfill is [MIT licensed]()

The ceddl-polyfill documentation and logos (e.g., .md, .png, .sketch)  files in the /demo, /docs and /assets folder) is [Creative Commons licensed]().

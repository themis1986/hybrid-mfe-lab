// The only runtime import of the engine. Modules register themselves on the core they import, so every
// path here (and in apps that opt into more modules) is the pure-ESM `es-modules/masters` build: one
// module graph, one engine. The default set: the core, accessibility (keyboard navigation, screen-reader
// descriptions) and the no-data message. Anything else (boost, exporting, more…) the app imports itself,
// e.g. `import 'highcharts/es-modules/masters/modules/boost.src.js'`, before its first chart renders.
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js'
import 'highcharts/es-modules/masters/modules/accessibility.src.js'
import 'highcharts/es-modules/masters/modules/no-data-to-display.src.js'

export { Highcharts }

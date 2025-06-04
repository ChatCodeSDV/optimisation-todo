import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter
} from '@opentelemetry/sdk-trace-base'
import { trace } from '@opentelemetry/api'
// import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'

import logger from './logger'

// Prometheus Exporter for metrics
/* const prometheusExporter = new PrometheusExporter({ port: 9464 }, () => {
  logger.info('Prometheus scrape endpoint: http://localhost:9464/metrics')
}) */

// Optionally, you can register the exporter with a MeterProvider if you are collecting metrics
/* import { MeterProvider } from '@opentelemetry/sdk-metrics'
const meterProvider = new MeterProvider(
  readers: [new prometheusExporter]
) */

// ConsoleSpanExporter for tracing
const consoleExporter = new ConsoleSpanExporter()
const provider = new NodeTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(consoleExporter)]
})

provider.register()

// Register instrumentations
registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()]
})

// Set global tracer
trace.setGlobalTracerProvider(provider)

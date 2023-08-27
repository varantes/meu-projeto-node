"use strict";

// [START opentelemetry_trace_import]
const opentelemetry = require("@opentelemetry/api");
const {NodeTracerProvider} = require("@opentelemetry/sdk-trace-node");
const {SimpleSpanProcessor} = require("@opentelemetry/sdk-trace-base");
const {TraceExporter,} = require("@google-cloud/opentelemetry-cloud-trace-exporter");
// [END opentelemetry_trace_import]

// [START setup_exporter]
// Enable OpenTelemetry exporters to export traces to Google Cloud Trace.
// Exporters use Application Default Credentials (ADCs) to authenticate.
// See https://developers.google.com/identity/protocols/application-default-credentials
// for more details.
const provider = new NodeTracerProvider();

// Initialize the exporter. When your application is running on Google Cloud,
// you don't need to provide auth credentials or a project id.
const exporter = new TraceExporter();

// Configure the span processor to send spans to the exporter
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// [END setup_exporter]

// [START opentelemetry_trace_custom_span]
function tracerTest() {
    console.log("Start recording test traces.");

    // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
    provider.register()
    const tracer = opentelemetry.trace.getTracer("basic");

    // Create a span.
    const span = tracer.startSpan("tracerTest");

    // Set attributes to the span.
    span.setAttribute("test-span-attribute-key", "test-span-attribute-value");

    // Annotate our span to capture metadata about our operation
    span.addEvent("invoking work of tracerTest");

    for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
      // simulate some random work.
    }

    // Be sure to end the span.
    span.end();
    // [END opentelemetry_trace_custom_span]

    console.log("Done recording test traces.");
}

tracerTest();

// [END opentelemetry_trace_samples]
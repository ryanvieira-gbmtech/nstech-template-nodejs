/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [], "controllers": [[import("./infra/prometheus/metric.controller"), { "MetricController": { "index": { type: String } } }], [import("./modules/example/http/controllers/example.controller"), { "ExampleController": { "findTerminalShifts": {} } }], [import("./infra/bucket/bucket.controller"), { "BucketController": { "generateUploadUrl": {} } }]] } };
};
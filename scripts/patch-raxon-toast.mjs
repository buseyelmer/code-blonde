/**
 * Disables automatic API success/error toasts from @raxonltd/raxon-core axios.
 * Keeps only the 401 session toast. App code shows one curated toast per action.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const target = path.join(
  process.cwd(),
  "node_modules/@raxonltd/raxon-core/dist/core/util/nexine.axios.js",
);

if (!existsSync(target)) {
  console.warn("[patch-raxon-toast] nexine.axios.js not found, skipping");
  process.exit(0);
}

let source = readFileSync(target, "utf8");

if (source.includes("/* code-blonde: skip-api-info-toasts */")) {
  console.log("[patch-raxon-toast] already patched");
  process.exit(0);
}

// Revert partial older patch marker if present, then apply full patch.
const successNeedleOriginal = `nexineAxios.interceptors.response.use(response => {
    var excludeArray = ['/auth/register'];
    if (!isSilentRequest(response.config) &&
        response.config.method != 'get' &&
        !excludeArray.includes(response.config.url || '')) {
        const successMessage = getApiToastMessage(response.data);
        if (successMessage) {
            toast.success(successMessage);
        }
    }
    return response;
}, error => {`;

const successNeedlePartial = `nexineAxios.interceptors.response.use(response => {
    /* code-blonde: skip-api-success-toast */
    return response;
}, error => {`;

const successReplacement = `nexineAxios.interceptors.response.use(response => {
    /* code-blonde: skip-api-info-toasts */
    return response;
}, error => {`;

if (source.includes(successNeedleOriginal)) {
  source = source.replace(successNeedleOriginal, successReplacement);
} else if (source.includes(successNeedlePartial)) {
  source = source.replace(successNeedlePartial, successReplacement);
} else if (!source.includes("/* code-blonde: skip-api-info-toasts */")) {
  console.warn("[patch-raxon-toast] unexpected success interceptor shape, skipping");
  process.exit(0);
}

const errorNeedle = `    if (!silent && error.response?.status !== 401) {
        const errorMessage = getApiToastMessage(error.response?.data);
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }
    return Promise.reject(error);`;

const errorReplacement = `    /* code-blonde: skip-api-info-toasts — non-401 errors handled by UI */
    return Promise.reject(error);`;

if (source.includes(errorNeedle)) {
  source = source.replace(errorNeedle, errorReplacement);
} else if (!source.includes("/* code-blonde: skip-api-info-toasts — non-401")) {
  console.warn("[patch-raxon-toast] unexpected error interceptor shape, skipping error patch");
}

writeFileSync(target, source);
console.log("[patch-raxon-toast] disabled API info auto-toasts (kept 401)");

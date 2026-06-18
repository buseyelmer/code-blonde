/**
 * Sunucu tarafı ortam değişkenleri (.env.local).
 * Route handler ve api-client içinde kullanın.
 */
export type ServerEnv = {
  apiBaseUrl: string;
  apiKey: string;
  ticimaxAjaxProToken: string;
  ticimaxMemberCode: string;
  siteUrl: string;
  storageUrl: string;
};

export type EnvValidationResult =
  | { ok: true; env: ServerEnv; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

function read(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function validateServerEnv(): EnvValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  const apiBaseUrl = read("NEXT_PUBLIC_API_URL");
  const apiKey = read("NEXT_PUBLIC_API_KEY") || read("API_KEY");
  const ticimaxAjaxProToken =
    read("TICIMAX_AJAXPRO_TOKEN") ||
    read("NEXT_PUBLIC_TICIMAX_AJAXPRO_TOKEN");
  const ticimaxMemberCode =
    read("TICIMAX_UYE_KODU") || read("NEXT_PUBLIC_TICIMAX_UYE_KODU");
  const siteUrl = read("NEXT_PUBLIC_SITE_URL") || read("TICIMAX_DOMAIN");
  const storageUrl = read("NEXT_PUBLIC_STORAGE_URL");

  if (!apiBaseUrl) {
    errors.push(
      "NEXT_PUBLIC_API_URL tanımlı değil. .env.local dosyasını proje kökünde kontrol edin.",
    );
  } else if (
    apiBaseUrl.includes("undefined") ||
    !/^https?:\/\//i.test(apiBaseUrl)
  ) {
    errors.push(`NEXT_PUBLIC_API_URL geçersiz: "${apiBaseUrl}"`);
  }

  if (!apiKey) {
    warnings.push(
      "NEXT_PUBLIC_API_KEY boş — x-api-key header'ı gönderilmeyecek.",
    );
  }

  if (!ticimaxAjaxProToken) {
    warnings.push(
      "TICIMAX_AJAXPRO_TOKEN boş — X-Ajaxpro-Token header'ı gönderilmeyecek.",
    );
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return {
    ok: true,
    env: {
      apiBaseUrl: apiBaseUrl.replace(/\/$/, ""),
      apiKey,
      ticimaxAjaxProToken,
      ticimaxMemberCode,
      siteUrl,
      storageUrl,
    },
    warnings,
  };
}

export function getServerEnv(): ServerEnv {
  const result = validateServerEnv();
  if (!result.ok) {
    throw new Error(result.errors.join(" "));
  }
  return result.env;
}

export function logEnvDiagnostics(_context: string): string[] {
  const result = validateServerEnv();
  return result.ok ? result.warnings : result.errors;
}

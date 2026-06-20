type SectionHomePageLoaderProps = {
  label?: string;
};

export function SectionHomePageLoader({
  label = "İçerik yükleniyor...",
}: SectionHomePageLoaderProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-stone border-t-brand-purple"
        aria-hidden="true"
      />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

type SectionHomePageErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function SectionHomePageError({
  message = "Veriler yüklenirken bir sorun oluştu.",
  onRetry,
}: SectionHomePageErrorProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="max-w-md text-sm text-charcoal">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-charcoal px-5 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-powder"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}

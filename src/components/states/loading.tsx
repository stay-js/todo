export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg className="mx-auto animate-spin fill-none" viewBox="0 0 24 24" width={size} height={size}>
    <circle className="stroke-green-500 stroke-[4] opacity-25" cx="12" cy="12" r="10" />
    <path
      className="fill-green-500"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const LoadingPage: React.FC = () => (
  <main
    className="grid place-content-center"
    style={{
      height: 'calc(100vh - 4.5rem)',
    }}
  >
    <LoadingSpinner size={48} />
  </main>
);

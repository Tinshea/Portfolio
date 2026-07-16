// Root layout of the /keystatic admin segment (outside the [locale] tree).
export default function KeystaticLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

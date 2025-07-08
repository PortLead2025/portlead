export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex my-auto flex-col gap-12 items-center justify-center">
      {children}
    </div>
  );
}

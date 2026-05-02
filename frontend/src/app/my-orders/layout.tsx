import AuthGuard from '@/components/AuthGuard';

export default function MyOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}

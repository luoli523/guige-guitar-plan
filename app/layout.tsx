import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '吉他 Solo 训练台',
  description: '12 周流行与民谣吉他 solo 系统训练计划。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OrderSuccessProps {
  orderId: string;
}

export default function OrderSuccess({ orderId }: OrderSuccessProps) {
  const router = useRouter();

  useEffect(() => {
    // 5초 후 메뉴 화면으로 자동 리다이렉트
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="text-8xl animate-bounce">✅</div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-primary">주문 완료!</h1>
          <p className="text-xl text-muted-foreground">
            주문번호: <span className="font-bold text-primary">{orderId}</span>
          </p>
          <p className="text-base text-muted-foreground">
            잠시 후 메뉴 화면으로 이동합니다...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-48 h-2 bg-[#e8dfd0] rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

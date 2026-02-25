'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrders } from '../api/order.api';
import { useOrderStore } from '../store/order-store';
import OrderItemComponent from './order-item';

export default function OrderHistoryPage() {
  const router = useRouter();
  const orders = useOrderStore((state) => state.orders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // TODO: 백엔드 API 연동 시 실제 주문 목록 가져오기
        const fetchedOrders = await getOrders();
        // Store에 추가 (중복 방지 로직 필요 시 추가)
        fetchedOrders.forEach((order) => {
          useOrderStore.getState().addOrder(order);
        });
      } catch (error) {
        console.error('주문 내역 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg font-medium text-primary">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-2xl border-0 shadow-soft">
        <CardHeader className="border-b border-border/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              📋 주문 내역
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-primary hover:bg-primary/5"
            >
              ← 뒤로
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <div className="text-5xl mb-3 opacity-30">📋</div>
              <p className="text-base font-medium">주문 내역이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderItemComponent key={order.id} order={order} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

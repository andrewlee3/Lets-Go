'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

const tableSetupSchema = z.object({
  storeId: z.string().min(1, '매장 식별자를 입력하세요'),
  tableId: z.string().min(1, '테이블 번호를 입력하세요'),
  tablePassword: z.string().min(1, '테이블 비밀번호를 입력하세요'),
});

type TableSetupForm = z.infer<typeof tableSetupSchema>;

export default function TableSetupForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TableSetupForm>({
    resolver: zodResolver(tableSetupSchema),
  });

  const onSubmit = async (data: TableSetupForm) => {
    setIsLoading(true);

    try {
      // TODO: 백엔드 API 연동
      // POST /api/customer/table/setup
      // const response = await apiClient.post('/api/customer/table/setup', data);
      // const { token } = response.data;

      // Mock: 임시 토큰 생성
      const mockToken = `mock_token_${data.storeId}_${data.tableId}`;

      // 로그인 처리
      login({
        ...data,
        token: mockToken,
      });

      // 메뉴 페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('Table setup failed:', error);
      alert('테이블 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>테이블 설정</CardTitle>
          <CardDescription>
            테이블 정보를 입력하여 주문을 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="storeId" className="block text-sm font-medium mb-1">
                매장 식별자
              </label>
              <Input
                id="storeId"
                {...register('storeId')}
                placeholder="예: store-001"
                className="btn-touch"
              />
              {errors.storeId && (
                <p className="text-sm text-red-500 mt-1">{errors.storeId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tableId" className="block text-sm font-medium mb-1">
                테이블 번호
              </label>
              <Input
                id="tableId"
                {...register('tableId')}
                placeholder="예: 1"
                className="btn-touch"
              />
              {errors.tableId && (
                <p className="text-sm text-red-500 mt-1">{errors.tableId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tablePassword" className="block text-sm font-medium mb-1">
                테이블 비밀번호
              </label>
              <Input
                id="tablePassword"
                type="password"
                {...register('tablePassword')}
                placeholder="비밀번호 입력"
                className="btn-touch"
              />
              {errors.tablePassword && (
                <p className="text-sm text-red-500 mt-1">{errors.tablePassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full btn-touch"
              disabled={isLoading}
            >
              {isLoading ? '설정 중...' : '시작하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

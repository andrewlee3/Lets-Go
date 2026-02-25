/**
 * 가격을 원화 형식으로 포맷팅
 * @param price - 포맷팅할 가격 (원 단위)
 * @returns 포맷팅된 가격 문자열 (예: "1,000원")
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ko-KR')}원`;
};

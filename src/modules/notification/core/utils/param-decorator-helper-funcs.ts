export const createParamDecoratorToken = (
  decorator: string,
  method: string,
): string => `${decorator}_${method}_index`;

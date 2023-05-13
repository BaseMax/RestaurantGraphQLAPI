import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserId = createParamDecorator((data: unknown, a) => {
  const gqlCtx = GqlExecutionContext.create(a)
  return gqlCtx.getContext().req.userId;
});

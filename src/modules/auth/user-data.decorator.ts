import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../users/user.model';
export interface UserAuth {
  id: string;
  role: Role;
}
export const UserData = createParamDecorator((data: unknown, a) => {
  const gqlCtx = GqlExecutionContext.create(a);
  return gqlCtx.getContext().req.user;
});

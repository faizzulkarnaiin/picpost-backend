import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectCreatedByBulk = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const bulk = req.body.data.map((item) => {
      return { ...item, created_by: { id: req.user.id } };
    });

    req.body.data = bulk;

    return req.body;
  },
);
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProvidersModule } from './providers/providers.module';
import { UsersModule } from './modules/users/users.module';
import { EnsureAuthenticated } from './providers/middlewares/ensure.authenticated.middleware';
import { EventsModule } from './modules/events/events.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { IsEventOwner } from './providers/middlewares/is-event-owner.middleware';
import { IsAdmin } from './providers/middlewares/is-admin.middleware';
import { IsRequestedUser } from './providers/middlewares/is-requested-user.middleware';

@Module({
  imports: [ProvidersModule, UsersModule, EventsModule, ReservationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  ensureAuthenticatedExclude = [
    { path: '/', method: RequestMethod.GET },
    { path: '/v1/auth/sign-in', method: RequestMethod.POST },
    { path: '/v1/users', method: RequestMethod.POST },
    { path: '/v1/events', method: RequestMethod.GET },
  ];

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .exclude(...this.ensureAuthenticatedExclude)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });

    consumer
      .apply(IsAdmin)
      .forRoutes(
        { path: '/v1/users', method: RequestMethod.GET },
        { path: '/v1/reservations', method: RequestMethod.GET },
        { path: '/v1/auth/reset-password/:id', method: RequestMethod.PUT },
      );

    consumer
      .apply(IsRequestedUser)
      .forRoutes(
        { path: '/v1/users/id', method: RequestMethod.GET },
        { path: '/v1/users/id', method: RequestMethod.PUT },
        { path: '/v1/users/id', method: RequestMethod.DELETE },
        { path: '/v1/auth/update-password/:id', method: RequestMethod.PUT },
      );

    consumer.apply(IsEventOwner).forRoutes(
      { path: '/v1/events/:id', method: RequestMethod.DELETE },
      { path: '/v1/events/:id', method: RequestMethod.PUT },
      {
        path: '/v1/reservations/requests/:eventId',
        method: RequestMethod.PUT,
      },
    );
  }
}

import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './providers/providers.module';
import { UsersModule } from './modules/users/users.module';
import { EnsureAuthenticated } from './providers/middlewares/ensure.authenticated.middleware';
import { UserIsInEvent } from './providers/middlewares/user-is-in-event.middleware';
import { EventsModule } from './modules/events/events.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [ProvidersModule, UsersModule, EventsModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  ensureAuthenticatedExclude = [
    { path: '/', method: RequestMethod.GET },
    { path: '/v1/auth/sign-in', method: RequestMethod.POST },
    { path: '/v1/residences', method: RequestMethod.GET },
    { path: '/v1/email', method: RequestMethod.POST },
    { path: '/v1/residences/:residenceId', method: RequestMethod.GET },
    { path: '/v1/users', method: RequestMethod.ALL },
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
      .apply(UserIsInEvent)
      .forRoutes(
        { path: '/v1/users', method: RequestMethod.POST },
        { path: '/v1/users/:id', method: RequestMethod.PUT },
      );
  }
}

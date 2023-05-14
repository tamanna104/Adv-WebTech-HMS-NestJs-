import { PatientModule } from './Patient/module/patient.module';
import { PatientController } from './Patient/controllers/patient.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './Admin/module/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// import { PatientService } from './Patient/services/patient.service';

@Module({
  imports: [PatientModule ,AdminModule, TypeOrmModule.forRoot(
    { type: 'postgres',
     host: 'containers-us-west-104.railway.app',
     port: 5472,
     username: 'postgres',
     password: 'Psb2rabQjMzwpybHSUPK',
     database: 'railway',
     autoLoadEntities: true,
     synchronize: true,
   }
   ),
   ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '../public'), // added ../ to get one folder back
    serveRoot: '/public/' //last slash was important
  }),
  ],

  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const port = 5050;
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? port);
  console.log("application started with port", port);
}
bootstrap();

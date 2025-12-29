import "reflect-metadata";
import { App } from "@app/app";
import Routes from "@app/modules";

const bootstrap = async () => {
    const application = new App(Routes);
    await application.start()
};

bootstrap();
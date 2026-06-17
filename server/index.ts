import { createApp } from "./app";
import { env } from "./env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[TraxJob] API listening on http://localhost:${env.PORT}`);
});

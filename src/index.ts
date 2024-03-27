import voiceMemoRoutes from "./routes/voice-memo";

import express from "express";
const app = express();
const port = 4000;
const jsonParser = express.json();

const router = express.Router();

app.get("/", (_req: any, res: any) => {
  res.send("Hello, World!");
});

app.use(jsonParser);

app.use(router);

router.use("/v1/api", voiceMemoRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

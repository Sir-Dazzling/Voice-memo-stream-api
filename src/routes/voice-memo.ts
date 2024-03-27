import express from "express";
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import handleAudioUpload from "../cloudinary";
import dotEnv from "dotenv";

dotEnv.config();

const router = express.Router();

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const speechFile = path.resolve("./speech.mp3");

router.post("/get-recording", async (req, res) => {
  if (!req?.body?.content) return res.status(400).send("Content is required");

  try {
    const mp3 = await openAi.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: req.body.content,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    const uploadRes = await handleAudioUpload(speechFile);

    if (!uploadRes) return res.status(500).send("Error streaming audio");

    res.setHeader("Content-Type", "application/json");
    res.send({ message: "success", audioUri: uploadRes });
  } catch (error) {
    console.error("error", error);
  }
});

router.get("get-recording-alt", async (_req, res) => {
  const mp3 = await openAi.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: "Today is a wonderful day to build something people love!",
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  const audioFile = fs.createReadStream(speechFile);

  console.log("mp3 ", mp3);
  // return res.sendFile(compiledFile);
  res.setHeader("Content-Type", "audio/mpeg");
  audioFile.pipe(res);
});

export default router;

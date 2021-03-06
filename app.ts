import { logger } from "./log.ts";

const IMG_URL = "https://www.fjordbat.no/webcam/mf_kragero.jpg";
const FETCH_INTERVAL = 45000;

const HOURS_DAY = 24;
const SECONDS_HOUR = 3600;
const MILLISECOND_SECOND = 1000;

const START_HOUR = 5;
const END_HOUR = 19;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchImage(sequenceNumber: number): Promise<void> {
  const num = `${sequenceNumber}`.padStart(4, "0");
  logger.debug(`Fetched new image #${num}`);

  const img = await fetch(IMG_URL);

  const imageBytes = new Uint8Array(await img.arrayBuffer());
  await Deno.writeFile(`./images/image${num}.jpg`, imageBytes);
}

const app = async () => {
  logger.debug(`Start fetching images from ${IMG_URL}`);

  const currentHour = new Date().getHours();

  let sleepTime = 0;

  if (currentHour >= END_HOUR) {
    sleepTime = (HOURS_DAY - currentHour) + START_HOUR;
  } else if (currentHour < START_HOUR) {
    sleepTime = START_HOUR - currentHour;
  }

  if (sleepTime != 0) {
    logger.debug(`Sleeping for ${sleepTime} hours`);
    await sleep(sleepTime * SECONDS_HOUR * MILLISECOND_SECOND);
  }

  let sequenceNumber = 1;
  while (true) {
    if (new Date().getHours() >= END_HOUR) {
      break;
    }

    try {
      await fetchImage(sequenceNumber);
    } catch (error) {
      logger.critical(error);
      continue;
    }

    sequenceNumber += 1;
    await sleep(FETCH_INTERVAL);
  }
};

app();

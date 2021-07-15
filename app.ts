const IMG_URL = "https://www.fjordbat.no/webcam/mf_kragero.jpg";
const FETCH_INTERVAL = 45000;
const HOURS_DAY = 24;
const START_HOUR = 6;
const SECONDS_HOUR = 3600;
const MILLISECOND_SECOND = 1000;
const END_HOUR = 19;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchImage(sequenceNumber: number): Promise<void> {
  const img = await fetch(IMG_URL);

  console.log(`Fetched new image #${sequenceNumber}`);

  const imageBytes = new Uint8Array(await img.arrayBuffer());
  await Deno.writeFile(`./images/image${sequenceNumber}.jpg`, imageBytes);
}

const app = async () => {
  console.log(`Start fetching images from ${IMG_URL}`);

  const currentHour = new Date().getHours();

  if (currentHour >= END_HOUR) {
    const sleepTime = (HOURS_DAY - currentHour) + START_HOUR;
    console.log(`Sleeping for ${sleepTime} hours`);
    await sleep(sleepTime * SECONDS_HOUR * MILLISECOND_SECOND);
  }

  let sequenceNumber = 1;
  while (true) {
    if (new Date().getHours() >= END_HOUR) {
      break;
    }

    await fetchImage(sequenceNumber);
    sequenceNumber += 1;

    await sleep(FETCH_INTERVAL);
  }
};

app();

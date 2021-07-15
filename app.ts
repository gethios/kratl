const IMG_URL = "https://www.fjordbat.no/webcam/mf_kragero.jpg";
const FETCH_INTERVAL = 45000;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function fetchImage(): Promise<void> {
  const img = await fetch(IMG_URL);

  const timestamp = +new Date();
  console.log(`Fetched new image at ${timestamp}`);

  const imageBytes = new Uint8Array(await img.arrayBuffer());
  await Deno.writeFile(`./images/image-${timestamp}.jpg`, imageBytes);
}

const app = async () => {
  console.log(`Start fetching images from ${IMG_URL}`);
  while (true) {
      await fetchImage();
      await sleep(FETCH_INTERVAL);
  }
};

app();

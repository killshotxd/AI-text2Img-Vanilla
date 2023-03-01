const oaiKey = config.SECRET_API_KEY;

const input = document.querySelector("#generate-input");
const button = document.querySelector("#generate-btn");
const results = document.querySelector(".results");

const state = {
  generating: false,
};

const fetchImages = async (prompt = "") => {
  if (!prompt) return;

  const reqUrl = `https://api.openai.com/v1/images/generations`;

  try {
    const response = await fetch(reqUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${oaiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: 6,
        size: "1024x1024",
      }),
    });

    const data = await response.json();

    const requiredData = data.data;

    if (!Array.isArray(requiredData)) return;

    const urls = requiredData.map((item) => item.url);

    results.innerHTML = "";
    urls.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;

      results.appendChild(img);
    });
  } catch (err) {
    results.innerHTML = `<p class="loading">${
      err?.message || "Failed to fetch image"
    }</p>`;
    console.log("Error fetching image", err);
    return false;
  }
};

const handleButtonClick = async () => {
  const value = input.value;
  if (!value.trim() || state.generating) return;

  state.generating = true;
  button.innerHTML = "Generating...";
  results.innerHTML = `<p class="loading">Loading...</p>`;
  await fetchImages(value.trim());
  state.generating = false;
  button.innerHTML = "Generate";
};

button.addEventListener("click", handleButtonClick);

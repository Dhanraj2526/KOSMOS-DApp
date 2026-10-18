const PINATA_API_KEY = "fa6bf856a3ea13baa422";
const PINATA_SECRET_KEY = "dd81d3456d1cfd63a1552f310f71b95ff2cacb40b413e8976a2ad40651c0338d";

document.getElementById("openSite").addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:3000" });
});

document.getElementById("sidebarBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "OPEN_SIDEBAR" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    if (response && response.status === "success") {
      window.close();
    }
  });
});

const uploadZone = document.getElementById("uploadZone");

// Handle Paste (Ctrl + V)
window.addEventListener("paste", (e) => {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const file = items[i].getAsFile();
      handleUpload(file);
    }
  }
});

// Handle Drag and Drop
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = "#14f0ff";
  uploadZone.style.background = "rgba(20, 240, 255, 0.1)";
});

uploadZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = "rgba(20, 240, 255, 0.3)";
  uploadZone.style.background = "rgba(255, 255, 255, 0.02)";
});

uploadZone.addEventListener("drop", async (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;

  if (files.length > 0) {
    handleUpload(files[0]);
  } else {
    // If it's an image dragged from a website, it might be a URL
    const imageUrl = e.dataTransfer.getData("text/uri-list");
    if (imageUrl) {
      uploadZone.innerHTML = "<p>FETCHING REMOTE IMAGE...</p>";
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "dragged_image.png", { type: blob.type });
        handleUpload(file);
      } catch (err) {
        alert("Cannot fetch image from this site. Try downloading it first.");
        uploadZone.innerHTML = "<p>DROP FILE TO SECURE</p>";
      }
    }
  }
});

async function handleUpload(file) {
  uploadZone.innerHTML = "<p>UPLOADING TO IPFS...</p>";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: formData,
    });
    const data = await res.json();
    const ipfsHash = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

    const metadata = {
      name: file.name || "Dragged Asset",
      type: file.type,
      image: ipfsHash,
      uploadedAt: new Date().toISOString()
    };

    const metaFormData = new FormData();
    const metaBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    metaFormData.append("file", new File([metaBlob], "metadata.json"));

    const metaRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: metaFormData,
    });
    const metaData = await metaRes.json();
    const metaHash = `https://gateway.pinata.cloud/ipfs/${metaData.IpfsHash}`;

    uploadZone.innerHTML = "<p>SUCCESS! OPENING KOSMOS...</p>";
    chrome.tabs.create({ url: `http://localhost:3000/?pendingHash=${metaHash}` });

  } catch (err) {
    console.error(err);
    alert("Upload failed.");
    uploadZone.innerHTML = "<p>DROP FILE TO SECURE</p>";
  }
}

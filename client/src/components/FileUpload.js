import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        setIsProcessing(true);

        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `fa6bf856a3ea13baa422`,
            pinata_secret_api_key: `dd81d3456d1cfd63a1552f310f71b95ff2cacb40b413e8976a2ad40651c0338d`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        
        const metadata = {
          name: file.name,
          type: file.type,
          image: ImgHash,
          uploadedAt: new Date().toISOString()
        };

        const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const jsonFile = new File([jsonBlob], "metadata.json", { type: 'application/json' });
        const jsonFormData = new FormData();
        jsonFormData.append("file", jsonFile);

        const resJson = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: jsonFormData,
          headers: {
            pinata_api_key: `fa6bf856a3ea13baa422`,
            pinata_secret_api_key: `dd81d3456d1cfd63a1552f310f71b95ff2cacb40b413e8976a2ad40651c0338d`,
            "Content-Type": "multipart/form-data",
          },
        });
        const MetadataHash = `https://gateway.pinata.cloud/ipfs/${resJson.data.IpfsHash}`;

        try {
          const transaction = await contract.add(account, MetadataHash);
          await transaction.wait();
          alert("Successfully File Secured!");
          
          if (onUploadSuccess) onUploadSuccess();

          setFileName("No file selected");
          setFile(null);
          setPreviewUrl(null);
        } catch (contractError) {
          console.error("Smart contract error:", contractError);
          alert("Pinata upload succeeded, but smart contract transaction failed.");
        }
      } catch (e) {
        alert("Unable to upload file to Pinata");
        console.error("Pinata upload error:", e);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
      if (data) {
        setPreviewUrl(URL.createObjectURL(data));
      }
    };
    setFileName(data.name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="image-preview" />
          ) : (
            "CHOOSE ASSET"
          )}
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        
        <span className="textArea">Asset: {fileName}</span>
        
        <button type="submit" className="upload" disabled={!file || isProcessing}>
          {isProcessing ? "SECURING..." : "SECURE ASSET"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;

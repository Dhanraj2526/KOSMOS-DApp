import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./Display.css";

const Display = ({ contract, account, showSearchOnly }) => {
  const [allFiles, setAllFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  const getdata = async () => {
    let dataArray;
    const otherAddress = document.querySelector(".address-display-input")?.value;
    
    setIsLoading(true);
    try {
      if (showSearchOnly) {
        if (otherAddress) {
          dataArray = await contract.display(otherAddress);
        } else {
          alert("Please enter a wallet address to search shared files.");
          setIsLoading(false);
          return;
        }
      } else {
        dataArray = await contract.display(account);
      }

      if (dataArray && dataArray.length > 0) {
        const results = await Promise.all(
          dataArray.map(async (url) => {
            try {
              const res = await axios.get(url);
              // Ensure we have a type, default to image if missing
              const type = res.data.type || (res.data.name?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
              return { ...res.data, type, selfHash: url };
            } catch (e) {
              return { name: "Encrypted File", image: url, type: "image/jpeg" };
            }
          })
        );
        setAllFiles(results);
      } else {
        setAllFiles([]);
        alert("No files found.");
      }
    } catch (e) {
      alert("You don't have access or error fetching data.");
    }
    setIsLoading(false);
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "kosmos_asset";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Download failed.");
    }
  };

  const renderThumbnail = (item) => {
    if (item.type?.includes("pdf") || item.name?.toLowerCase().endsWith(".pdf")) {
      return (
        <div className="pdf-thumbnail">
          <span className="pdf-icon">PDF</span>
          <span className="file-ext">DOCUMENT</span>
        </div>
      );
    }
    return <img src={item.image} alt={item.name} />;
  };

  const renderPreview = (item) => {
    if (item.type?.includes("pdf") || item.name?.toLowerCase().endsWith(".pdf")) {
      return (
        <iframe 
          src={`${item.image}#toolbar=0`} 
          className="pdf-preview-frame" 
          title="PDF Preview"
        />
      );
    }
    return <img src={item.image} alt="Preview" className="full-preview-img" />;
  };

  const filteredFiles = allFiles.filter(file => 
    file.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="display-wrapper">
      {showSearchOnly && (
        <div className="shared-header-container">
          <h2 className="shared-title-center">SHARED WITH ME</h2>
        </div>
      )}

      <div className="shared-access-header">
        {showSearchOnly && (
          <input
            type="text"
            placeholder="Wallet address (0x...)"
            className="address-display-input highlighted"
          />
        )}
        <button className="highlighted-btn" onClick={getdata}>
          {showSearchOnly ? "FETCH SHARED ASSETS" : "REFRESH MY DRIVE"}
        </button>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by name, tags, or file type..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Syncing Ledger Assets...</p>
        </div>
      ) : (
        filteredFiles.length > 0 && (
          <div className="image-list">
            {filteredFiles.map((item, i) => (
            <div className="image-card" key={i} onClick={() => setModalData(item)}>
              <div className="image-container">
                {renderThumbnail(item)}
                <div className="image-overlay">
                  <span>OPEN ASSET</span>
                </div>
              </div>
              <div className="image-info">
                <p className="image-name">{item.name}</p>
                <div className="image-tags">
                  <span className="type-tag">{item.type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                  {item.tags?.map((tag, j) => (
                    <span key={j} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )
      )}

      {modalData && (
        <div className="modal-overlay">
          <div className="preview-modal">
            <div className="preview-header">
              <h2 className="preview-title">{modalData.name}</h2>
              <button className="close-preview" onClick={() => setModalData(null)}>&times;</button>
            </div>
            
            <div className="preview-content">
              <div className="preview-left">
                {renderPreview(modalData)}
              </div>
              
              <div className="preview-right">
                <div className="action-card">
                  <h3>ASSET ACTIONS</h3>
                  <button 
                    className="action-btn download" 
                    onClick={() => downloadFile(modalData.image, modalData.name)}
                  >
                    DOWNLOAD {modalData.type?.includes('pdf') ? 'PDF' : 'IMAGE'}
                  </button>
                  <button className="action-btn share" onClick={() => {
                    alert("IPFS link copied!");
                    navigator.clipboard.writeText(modalData.image);
                  }}>
                    COPY LINK
                  </button>
                </div>

                <div className="qr-card">
                  <h3>PORTABILITY</h3>
                  <div className="qr-box">
                    <QRCodeCanvas value={modalData.image} size={140} level="H" />
                  </div>
                  <p>Scan to view on mobile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Display;

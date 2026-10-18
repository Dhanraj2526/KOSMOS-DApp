import { useEffect, useState, useRef } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract, isStatic }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessList, setAccessList] = useState([]);
  const addressRef = useRef(null);

  const sharing = async () => {
    const address = addressRef.current.value;
    if (!address) return alert("Please enter an address");
    
    try {
      setIsLoading(true);
      const tx = await contract.allow(address);
      await tx.wait();
      alert("Access granted successfully!");
      if (!isStatic) setModalOpen(false);
      fetchAccessList(); // Refresh list
    } catch (e) {
      console.error(e);
      alert("Error granting access.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccessList = async () => {
    try {
      const list = await contract.shareAccess();
      setAccessList(list.filter(item => item.access));
    } catch (err) {
      console.error("Error fetching access list", err);
    }
  };

  useEffect(() => {
    if (contract) fetchAccessList();
  }, [contract]);

  const content = (
    <div className={`modalContainer ${isStatic ? "static-mode" : ""}`}>
      <div className="title">ACCESS CONTROL CENTER</div>
      
      <div className="modal-body">
        <div className="input-group">
          <label>GRANT NEW PERMISSION</label>
          <input
            type="text"
            ref={addressRef}
            className="address-input"
            placeholder="Enter wallet address (0x...)"
          />
          <button 
            className="share-btn-modal" 
            onClick={sharing} 
            disabled={isLoading}
          >
            {isLoading ? "GRANTING..." : "GRANT ACCESS"}
          </button>
        </div>

        <div className="divider-line"></div>

        <div className="list-group">
          <label>AUTHORIZED PERSONNEL</label>
          <div className="address-list-box">
            {accessList.length > 0 ? (
              accessList.map((item, index) => (
                <div key={index} className="authorized-address">
                  <span className="user-icon">👤</span>
                  {item.user}
                </div>
              ))
            ) : (
              <div className="no-access">No authorized users found.</div>
            )}
          </div>
        </div>
      </div>

      {!isStatic && (
        <div className="footer">
          <button onClick={() => setModalOpen(false)} id="cancelBtn">
            CLOSE
          </button>
        </div>
      )}
    </div>
  );

  if (isStatic) return <div className="static-permissions-wrapper">{content}</div>;

  return (
    <div className="modalBackground">
      {content}
    </div>
  );
};
export default Modal;

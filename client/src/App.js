import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import DashboardHome from "./components/DashboardHome";
import contractConfig from "./contractAddress.json";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [logged, setLogged] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [totalFiles, setTotalFiles] = useState(0);
  const [blockNumber, setBlockNumber] = useState("...");

  const fetchStats = async (contract, address, provider) => {
    try {
      // 1. Get File Count
      const data = await contract.display(address);
      setTotalFiles(data.length);

      // 2. Get Live Block Number
      const block = await provider.getBlockNumber();
      setBlockNumber(block);
    } catch (error) {
      console.error("Stats fetch error", error);
    }
  };

  const checkRegistration = async (contract, address) => {
    try {
      const registered = await contract.isRegistered(address);
      if (registered) {
        const name = await contract.usernames(address);
        setUsername(name);
      }
      setIsRegistered(registered);
    } catch (error) {
      console.error("Check registration error", error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        let contractAddress = contractConfig.address;
        const { chainId } = await provider.getNetwork();

        if (chainId !== 11155111 && chainId !== 1337 && chainId !== 31337) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }],
            });
          } catch (error) {
            console.error("Network switch error", error);
          }
        }

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
        setLogged(true);
      } catch (error) {
        console.error("Wallet connection error", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleLogin = async () => {
    try {
      const signer = provider.getSigner();
      const message = `Log in to KOSMOS - Secure Decentralized Drive\nVerification for: ${account}`;
      const signature = await signer.signMessage(message);
      
      if (signature) {
        await checkRegistration(contract, account);
        await fetchStats(contract, account, provider);
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Login signature error", error);
      alert("Verification failed. Please sign the message to log in.");
    }
  };

  const logout = () => {
    setLogged(false);
    setIsVerified(false);
    setAccount("");
    setContract(null);
    setProvider(null);
    setIsRegistered(false);
    setUsername("");
    setActiveTab("home");
    setTotalFiles(0);
    setBlockNumber("...");
  };

  useEffect(() => {
    const handlePendingHash = async () => {
      const params = new URLSearchParams(window.location.search);
      const hash = params.get("pendingHash");
      
      if (hash && contract && account) {
        const confirm = window.confirm("File detected from Extension! Would you like to secure it to the blockchain?");
        if (confirm) {
          try {
            const transaction = await contract.add(account, hash);
            await transaction.wait();
            alert("Success! File secured via extension.");
            // Remove the param from URL
            window.history.replaceState({}, document.title, "/");
            await fetchStats(contract, account, provider);
          } catch (e) {
            console.error(e);
            alert("Failed to secure file. Check balance.");
          }
        }
      }
    };
    
    if (isVerified && isRegistered) {
      handlePendingHash();
    }
  }, [isVerified, isRegistered, contract, account]);

  if (!logged) {
    return <Landing connectWallet={connectWallet} />;
  }

  if (!isVerified) {
    return <Login onLogin={handleLogin} account={account} />;
  }

  if (!isRegistered) {
    return (
      <SignUp 
        contract={contract} 
        account={account} 
        onRegisterSuccess={() => checkRegistration(contract, account)} 
      />
    );
  }

  return (
    <>
      <Navbar 
        account={account} 
        username={username} 
        onLogout={logout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="App">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>

        <div className="tab-content">
          {activeTab === "home" && (
            <DashboardHome 
              username={username} 
              account={account} 
              totalFiles={totalFiles}
              blockNumber={blockNumber}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "drive" && (
            <div className="main-content">
              <div className="upload-section">
                <FileUpload
                  account={account}
                  provider={provider}
                  contract={contract}
                  onUploadSuccess={() => fetchStats(contract, account, provider)}
                ></FileUpload>
              </div>
              <div className="display-section">
                <Display contract={contract} account={account}></Display>
              </div>
            </div>
          )}

          {activeTab === "shared" && (
            <div className="shared-section">
              <Display contract={contract} account={account} showSearchOnly={true}></Display>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="permissions-section">
              <h2 className="section-title">ACCESS CONTROL</h2>
              <p className="section-subtitle">Manage who can view your decentralized assets.</p>
              <Modal setModalOpen={() => {}} contract={contract} isStatic={true}></Modal>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

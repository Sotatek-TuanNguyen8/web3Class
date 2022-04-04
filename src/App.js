import { useWeb3React } from "@web3-react/core";
import { Input, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { approve, convertTimestamp, deposit, withdraw } from "./common";
import { getData } from "./common/mutilcall";
import { injected, walletconect } from "./connector";
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import Web3 from "web3";
import moment from "moment";
function App() {
  const {account, activate, active, library} = useWeb3React()
  const [dataUser,setDataUser] = useState()
  const [dataHistory,setDataHistory] = useState()
  const [modalStake,setModalStake] = useState()
  const [modalWithdraw,setModalWithdraw] = useState()
  const stakeInputRef = useRef({})

  const connectMetamask = () => {
    activate(injected)
  }

  const connectWallet = () => {
    activate(walletconect)
  }

  const getHistory = ()=>{
    const query = `{
      approvalEntities(where: {src: "${account}"}) {
        id
        src
        guy
        amout
        time
        type
      }
      transferEntities(where: {src: "${account}"}) {
        id
        src
        des
        amout
        time
        type
      }
      depositEntities(where: {des: "${account}"}){
        id
        des
        amout
        time
        type
      }
      withdrawEntities(where: {src: "${account}"}) {
        id
        src
        amout
        time
        type
      }
    }`
    fetch(`https://api.thegraph.com/subgraphs/name/sotatek-tuannguyen8/web3-classs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query
      }),
    }).then(res => {
      if (res.status >= 400) {
        throw new Error("Error fetching data");
      } else {
        return res.json();
      }
    })
    .then(data => {
      const {approvalEntities,depositEntities,transferEntities,withdrawEntities} = data.data
      const arData = approvalEntities.concat(depositEntities,transferEntities,withdrawEntities)
      setDataHistory(arData.sort(function(a, b) {
        return parseInt(a.time) - parseInt(b.time);
      }))
    }) 
  }

  useEffect(() => {
   if(account && library) {
    (async() => {
      const data = await getData(library,account)
      getHistory()
      setDataUser(data)
    })()
   };
    
  },[account,library])


  return (
    <div className="App" style={{height:'100vh',display: 'flex',justifyContent:"center",alignItems: 'center'}}> 
        {!active 
        ? <div style={{height: '50vh',display: 'flex', flexDirection: 'column',justifyContent: 'space-around',alignItems: 'center'}}>
            <button style={{height:50,width:200}} onClick={connectMetamask}>Connect Metamask</button>
            <button style={{height:50,width:200}} onClick={connectWallet}>Connect Walletconnect</button>
          </div> 
        : <div style={{display: 'flex',gap:30,justifyContent: 'center' ,alignItems:"center"}}>
            <div style={{display:'flex',flexDirection:'column',alignItems: 'center',width:500,height:"auto",gap:20,border:'1px solid black',padding:'30px 30px',margin:'0px auto'}}>
                <div >Wallet address: {account}</div>
                <div >Balace: {dataUser?.balance} WETH</div>
                <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center',width:'100%'}}>
                  <div >Token earned: {dataUser?.tokenEarned} DD2</div>
                  <button onClick={() =>deposit(library,account,'0')}>Harvest</button>
                </div>
                <div style={{width:'100%'}}>
                  {dataUser?.isApproved === '0.0' ? 
                  <button style={{width:'30%',height:40}}
                    onClick = {() => approve(library,account,'1')}
                  >
                    Approve
                  </button> : 
                  <div style={{width:'100%',display:'flex',alignItems: 'center',justifyContent: 'space-between'}}>
                    <button style={{width:'30%',height:40}}
                      onClick={() => setModalStake(true)}
                    >
                      Deposit
                    </button>
                    <button style={{width:'30%',height:40}}
                      onClick={() => setModalWithdraw(true)}
                    >
                      Withdraw
                    </button>
                  </div>}
                </div>
                <div style={{width:'100%'}}>
                  Your take: {dataUser?.stake} WETH
                </div>
                <div style={{width:'100%'}}>
                  Total Stake: {dataUser?.totalStake} WETH
                </div>
            </div>
            <div>
              <table>
                <tr style={{border: '1px solid black'}}>
                  <th style={{border: '1px solid black',padding:30}}>Action</th>
                  <th style={{border: '1px solid black',padding:30}}>Amout</th>
                  <th style={{border: '1px solid black',padding:30}}>Time</th>
                </tr>
                {dataHistory?.map((item,index) =>
                  <tr key={index}>
                    
                    <td style={{border: '1px solid black',padding:30}}>{item.type}</td>
                    <td style={{border: '1px solid black',padding:30}}>{ethers.utils.formatEther(item.amout)}</td>
                    <td style={{border: '1px solid black',padding:30}}><span>{moment(convertTimestamp(item.time).toString()).format("HH:mm:ss DD/MM/YYYY")}</span></td>
                  </tr>
                )}
              </table>
            </div>

        </div>
          
          }
          
          <Modal title="Stake" visible={modalStake} 
            onOk={() => {deposit(library,account,stakeInputRef.current.value);setModalStake(false)}} 
            onCancel={() => setModalStake(false)}
          >
            <input placeholder="input your amount" style={{width:'50%',height:40,borderRadius:5}} ref={stakeInputRef}></input>        
            <div style={{marginTop:10}}>Your WETH balance: {dataUser?.balance}</div>
          </Modal>
          <Modal title="Stake" visible={modalWithdraw} 
            onOk={() => {withdraw(library,account,stakeInputRef.current.value);setModalWithdraw(false)}} 
            onCancel={() => setModalWithdraw(false)}
          >
            <input placeholder="input your amount" style={{width:'50%',height:40,borderRadius:5}} ref={stakeInputRef}></input>        
            <div style={{marginTop:10}}>Your WETH deposited: {dataUser?.isApproved}</div>
          </Modal>
    </div>
  );
}

export default App;

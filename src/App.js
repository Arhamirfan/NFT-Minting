import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft,setClaimingNft] = useState(false);
  const [feedback,setFeedback] = useState("It's your lucky day");

  const claimNft = (_amount) =>{
    setClaimingNft(true);
    blockchain.smartContract.methods.mint(blockchain.account,_amount).send({
      from: blockchain.account,
      value: blockchain.web3.utils.toWei(String(0.01*_amount),"ether"),
    }).once("error", (err)=>{
      console.log(err);
      setFeedback("Error");
      setClaimingNft(false);
    }).then((receipt) => {
      setFeedback("success");
      setClaimingNft(false);
    });
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);

  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container flex={1} ai={"center"} style={{ padding: 24, backgroundColor:"purple" }}>
          <s.TextTitle style={{ textAlign: "center" }}>
            Name: {data.name}. <br></br> Claim Your NFT
          </s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            disabled={claimingNft? 1:0}
            onClick={(e) => {
              e.preventDefault();
              claimNft(1);
              // dispatch(connect());
            }}
          >
            {claimingNft ? "WAIT..": "Buy 1 Reckless Racoon NFT"}
          </StyledButton>
          <s.SpacerSmall />
          <s.SpacerSmall />
          <StyledButton
          disabled={claimingNft? 1:0}
            onClick={(e) => {
              e.preventDefault();
              claimNft(2);
              // dispatch(connect());
            }}
          >
            {claimingNft? "WAIT..": "Buy 2 RRC NFT"}
          </StyledButton>
          <s.SpacerSmall />
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;

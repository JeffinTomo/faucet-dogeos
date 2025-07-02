import React, { useEffect, useState } from "react";
import { formatEther, createPublicClient, http } from "viem";
import { BigNumber } from "bignumber.js";

import "./faucet.css";
import { CustomButton } from "./components/CustomButton";
import { addToast } from "@heroui/react";

const network = {
  chainId: 221122420,
  chainIndex: 221122420,
  name: "DOGEOS_DEVTNET",
  chainName: "DogeOS Devnet",
  rpcUrls: ["https://rpc.devnet.doge.xyz"],
  blockExplorerUrl: "https://blockscout.devnet.doge.xyz/tx/{txId}",
  platformType: "EVM",
  isTestnet: true,
  icon: "https://static.tomo.inc/token/dogeos.svg",
  supportSwap: true,
  supportGift: false,
  supportHistory: false,
};

function createWalletClient(network: any) {
  const { chainId, name, rpcUrls, nativeCurrency = {} } = network;

  const myCustomChain = {
    id: Number(chainId) || chainId,
    name,
    nativeCurrency,
    rpcUrls: {
      default: {
        http: rpcUrls,
        webSocket: [],
      },
      public: {
        http: rpcUrls,
        webSocket: [],
      },
    },
    blockExplorers: {
      default: {
        name: "Explorer",
        url: rpcUrls[0],
      },
    },
  };

  const rpcClient = createPublicClient({
    chain: myCustomChain,
    pollingInterval: 10_000,
    cacheTime: 10_000,
    transport: http(),
  });

  return rpcClient;
}

export default function DogeFaucet() {
  const amount = 40;
  const [balance, setBalance] = useState<string>("0");
  const [address, setAddress] = useState<string>("");
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    const currentAddress = new URLSearchParams(window.location.search).get("address") || "";
    setAddress(currentAddress);
  }, []);

  useEffect(() => {
    if (!address) return;
    (async () => {
      try {
        const publicClient = createWalletClient(network);
        const res = await publicClient.getBalance({
          address: address as `0x${string}`,
        })
        const balance = new BigNumber(formatEther(res)).toNumber().toFixed(3);
        setBalance(balance);
      } catch (error) {
        console.error("Failed to getBalance:", error);
      }
    })();
  }, [address]);

  const clamTestDoge = async (address: string) => {
    const grecaptcha: any = window?.grecaptcha;

    const recaptchaResponse = grecaptcha?.getResponse();
    if (!recaptchaResponse) {
      throw new Error("Please complete the reCAPTCHA");
      return;
    }
    return fetch("https://faucet-api.devnet.doge.xyz/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: address,
        recaptchaResponse: recaptchaResponse,
      }),
    })
      .then((response) => {
        // Check for 429 status (rate limit exceeded)
        if (response.status === 429) {
          return response.json().then((data) => {
            throw new Error(data.message || "Rate limit exceeded");
          });
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          return data;
          grecaptcha.reset();
        } else {
          throw new Error(data.message || "Faucet request failed");
        }
      })
      .catch((error) => {
        // Show error message
        throw new Error(error.message);
        grecaptcha.reset();
      })
      .finally(() => {
        grecaptcha.reset();
      });
  };

  return (
    <div id="dogeos-faucet" className="dogeos-faucet overflow-y-auto scrollbar-hide">
      <div id="dogeos-balance" className="dogeos-faucet-part dogeos-faucet-balance">
        <div>My $DOGE (test token) balance</div>
        <div className="dogeos-balance-value">
          ~{balance} DOGE
        </div>
        <div>{address}</div>
      </div>

      <div id="dogeos-faucet-intro" className="dogeos-faucet-part dogeos-faucet-intro">
        <h2>🚰 What is a faucet?</h2>
        <p>
          A faucet lets you claim free tokens for testing purposes on a <em>testnet</em> — a blockchain environment that
          simulates real transactions without using real assets.{" "}
        </p>
        <p>
          These testnet tokens are <em>not real DOGE</em> and <em>have no monetary value</em>.
        </p>
      </div>

      <div id="dogeos-faucet-amount" className="dogeos-faucet-part dogeos-faucet-amount">
        <h2>🐶 How Much Testnet DOGE Can I Get?</h2>
        <p>
          You can request <em>{amount} ÐOGE per day</em>. No real funds are involved — it&apos;s just for testing.
        </p>
      </div>

      <div id="dogeos-use" className="dogeos-faucet-part dogeos-faucet-use">
        <h2>🧪 What Can I Do With Testnet DOGE?</h2>
        <div>
          With your testnet ÐOGE, you can:
          <ol>
            <li>Try out new features safely</li>
            <li>Interact with dApps without financial risk</li>
            <li>
              Help us test <em>chain performance under load</em> — your activity contributes to important stress testing
              as we scale DogeOS!
            </li>
          </ol>
        </div>
      </div>


      <div
        style={{
          width: "310px",
          margin: "0 auto",
        }}
        className="g-recaptcha"
        data-sitekey="6LcKSe4qAAAAAKsAzMIWQNd5JBhpv5lX4dPVaMyb"
      ></div>

      <div className="h-[120px]"></div>

      <div className="fixed bottom-0 left-0 right-0 w-full p-4 pb-8 pt-0 text-center ring-0">
        <CustomButton
          color="primary"
          className="tomo-btn-approve w-full"
          isDisabled={isClaimed}
          onPress={async () => {
            const errMsg = "claim test token err, please retry.";
            try {
              const res = await clamTestDoge(address);
              console.log("clamTestDoge", res);
              if (!res.success) {
                addToast({
                  title: errMsg,
                  color: "warning",
                })
                return;
              }
              setIsClaimed(true);
              addToast({
                title: `"Ð${amount} claimed successfully!"`,
                color: "success",
              })
            } catch (err) {
              addToast({
                title: err?.message || errMsg,
                color: "warning",
              })
            }
          }}
        >
          {isClaimed ? "Limit reached. Please try tomorrow" : `Claim Ɖ ${amount} now!`}
        </CustomButton>
      </div>
    </div>
  );
}

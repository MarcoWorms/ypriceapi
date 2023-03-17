import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { useSignMessage, useAccount, useContractRead, useContractReads } from 'wagmi'
import { useState, useEffect } from 'react';
import ypriceapiABI from './ypriceapiABI.json'

const Plan = props => {
  return (
    <div>
      <h3>Plan {props.id}</h3>
      <p>Price per second:</p>
      <span>{props.price}</span>
      <p>Rate limit per second:</p>
      <span>{props.rateLimit}</span>
      <p>Time Interval:</p>
      <span>{props.timeInterval}</span>
    </div>
  )
}

const yPriceData = {
  address: '0x348988740a353CF7c53a549b22F5E3C3fc0f98DA',
  abi: ypriceapiABI,
}

const Home = () => {
  const [connected, setConnected] = useState(false)
  const [planCount, setPlanCount] = useState(0)

  const { data, signMessage } = useSignMessage()

  const { isConnected } = useAccount()

  const { data: _planCount } = useContractRead({
    ...yPriceData,
    functionName: 'plan_count',
  })

  const { data: _plans } = useContractReads({
    contracts: Array.from({ length: planCount }, (_, i) => ({
      ...yPriceData,
      functionName: 'get_plan',
      args: [i + 1],
    })),
  })

  useEffect(() => {
    if (_planCount) {
      setPlanCount(_planCount)
    }
  }, [_planCount])

  useEffect(() => {
    if (isConnected) {
      setConnected(true)
    }
  }, [isConnected])

  return (
    <div>
      <Head>
        <title>yPrice API Plans</title>
        <meta
          content="yPrice API Plans"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <h1>yPrice API</h1>
        {/* <p style={{fontFamily: 'monospace', color: '#0675F9', backgroundColor: '#eee', fontSize: 16}}>ypriceapi.yearn.farm</p> */}
        <br />
        {connected ? (
          <>
            <span>
              <ConnectButton showBalance={false} accountStatus="address" />
            </span>
            <p>
              1) Subscribe to yPriceAPI onchain using the <u><a href="https://etherscan.io/address/0x348988740a353CF7c53a549b22F5E3C3fc0f98DA">contract</a></u>
            </p>
            <p>
              2) Sign the message below to prove ownership of this wallet.
            </p>
            <p>
              3) Use your signed message in request to yPriceAPI
            </p>
            <button className="sign" onClick={async () => {
              signMessage({message: 'I am proving ownership of this wallet so I can use my ypriceapi subscription' })
            }}>Sign Wallet Ownership Proof</button>
            {data && (
              <>
                <p>{data}</p>
                <button onClick={() => {
                  navigator.clipboard.writeText(data)
                }}>Copy</button>
              </>
            )}
            <h2>Available yPriceAPI Plans</h2>
            <div className="plans">
              { console.log(_plans) ||
                _plans && _plans.map((plan, i) => ([...plan, i + 1])).filter(plan => plan[0]).map((plan, i) => (
                  <Plan
                    title={plan.name}
                    price={plan[1].toString()}
                    rateLimit={plan[2].toString()}
                    timeInterval={plan[3].toString()}
                    id={plan[4].toString()}
                    key={plan[4].toString()}
                  />
                ))
              }
              
            </div>
          </>  
        ) : (
          <ConnectButton showBalance={false} accountStatus="address" />
        )}
        {/* <input type="text" placeholder='address' /> */}
      </main>
    </div>
  );
};

export default Home;

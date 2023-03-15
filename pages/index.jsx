import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { useSignMessage, useAccount } from 'wagmi'
import { useState, useEffect } from 'react';

const Home = () => {
  const [connected, setConnected] = useState(false)

  const { data, error, isLoading, signMessage } = useSignMessage()

  const { isConnected } = useAccount()

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
        <h1>yPrice API Plans</h1>
        <br />
        {connected ? (
          <>
            <span>
              <ConnectButton showBalance={false} accountStatus="address" />
            </span>
            <div className="plans">
              <div>
                <h2>Plan 1</h2>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <button onClick={async () => {
                  signMessage({message: 'I am proving ownership of this wallet so I can use my ypriceapi subscription' })
                }}>Sign Plan</button>
              </div>
              <div>
                <h2>Plan 2</h2>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <button onClick={async () => {
                  signMessage({message: 'I am proving ownership of this wallet so I can use my ypriceapi subscription' })
                }}>Sign Plan</button>
              </div>
              <div>
                <h2>Plan 3</h2>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <p>Awesome plan! Like seriously you should totally buy this one.</p>
                <button onClick={async () => {
                  signMessage({message: 'I am proving ownership of this wallet so I can use my ypriceapi subscription' })
                }}>Sign Plan</button>
              </div>
            </div>
            <br />
            {data && (
              <>
                <p>{data}</p>
                <button onClick={() => {
                  navigator.clipboard.writeText(data)
                }}>Copy</button>
              </>
            )}
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

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { useSignMessage, useAccount, useContractWrite, useContractRead, useContractReads, usePrepareContractWrite } from 'wagmi'
import { useState, useEffect } from 'react';
import ypriceapiABI from './ypriceapiABI.json'
import daiABI from './daiABI.json'

const yPriceData = {
  address: '0x348988740a353CF7c53a549b22F5E3C3fc0f98DA',
  abi: ypriceapiABI,
}

const MAX_APPROVAL_VALUE = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const Plan = props => {

  const { write: subscribePlanDay } = useContractWrite({
    ...yPriceData,
    functionName: 'subscribe',
    args: [props.id, props.price * 60 * 24],
  })

  const { write: subscribePlanWeek } = useContractWrite({
    ...yPriceData,
    functionName: 'subscribe',
    args: [props.id, props.price * 60 * 24 * 7],
  })

  const { write: subscribePlanMonth } = useContractWrite({
    ...yPriceData,
    functionName: 'subscribe',
    args: [props.id, props.price * 60 * 24 * 30],
  })

  const { write: subscribePlanHalfYear } = useContractWrite({
    ...yPriceData,
    functionName: 'subscribe',
    args: [props.id, props.price * 60 * 24 * 180],
  })

  const { write: subscribePlanYear } = useContractWrite({
    ...yPriceData,
    functionName: 'subscribe',
    args: [props.id, props.price * 60 * 24 * 360],
  })

  return (
    <div>
      <h3>Plan {props.id}</h3>
      <b><p>Price:</p></b>
      <span>{props.price} <span style={{color:'black', fontSize: 10}}>wei of dai, per second</span></span>
      <span>{props.price * 60} <span style={{color:'black', fontSize: 10}}>wei of dai, per hour</span></span>
      <span>{props.price * 60 * 24} <span style={{color:'black', fontSize: 10}}>wei of dai, per day</span></span>
      <span>{props.price * 60 * 24 * 7} <span style={{color:'black', fontSize: 10}}>wei of dai, per week</span></span>
      <span>{props.price * 60 * 24 * 30} <span style={{color:'black', fontSize: 10}}>wei of dai, per month</span></span>
      <span>{props.price * 60 * 24 * 180} <span style={{color:'black', fontSize: 10}}>wei of dai, per half year</span></span>
      <span>{props.price * 60 * 24 * 360} <span style={{color:'black', fontSize: 10}}>wei of dai, per year</span></span>
      <b><p>Rate limit per second:</p></b>
      <span>{props.rateLimit}</span>
      <b><p>Time Interval:</p></b>
      <span>{props.timeInterval}</span>
      <br />
      {props.hasAllowance && <b><p>Choose amount of days to subscribe:</p></b>}
      <div>
        <div>
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanDay()
          }}>1</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanWeek()
          }}>7</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanMonth()
          }}>30</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanHalfYear()
          }}>180</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanYear()
          }}>360</button>}
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  const [connected, setConnected] = useState(false)
  const [planCount, setPlanCount] = useState(0)

  const { data, signMessage } = useSignMessage()

  const { isConnected, address } = useAccount()

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

  const { config: approveConfig } = usePrepareContractWrite({
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    abi: daiABI,
    functionName: 'approve',
    args: [yPriceData.address, MAX_APPROVAL_VALUE],
  })
  const { write: approveDaiSpending } = useContractWrite(approveConfig)
  const { data: allowance } = useContractRead({
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    abi: daiABI,
    functionName: 'allowance',
    args: [address, yPriceData.address],
    watch: true,
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
            Use your signed message in requests to yPriceAPI
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
            {allowance?.toString() === '0' && <button className='approve' onClick={async () => {
              approveDaiSpending()
            }}>Allow DAI Spending</button>}
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
                    hasAllowance={allowance?.toString() !== '0'}
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

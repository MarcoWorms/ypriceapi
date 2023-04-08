import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { useSignMessage, useAccount, useContractWrite, useContractRead, useContractReads, usePrepareContractWrite } from 'wagmi'
import { useState, useEffect } from 'react';
import ypriceapiABI from './ypriceapiABI.json'
import daiABI from './daiABI.json'

const yPriceData = {
  address: '0xee320e44809355a04a93d8336B7978553D7f7042',
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
      <h3>Plan {props.title}</h3>
      <b><p>Price:</p></b>
      <span>{((props.price/10**18)).toFixed(8)} <span style={{color:'black', fontSize: 10}}> dai, per second</span></span>
      <span>{((props.price/10**18) * 60).toFixed(8)} <span style={{color:'black', fontSize: 10}}> dai, per hour</span></span>
      <span>{((props.price/10**18) * 60 * 24).toFixed(8)} <span style={{color:'black', fontSize: 10}}> dai, per day</span></span>
      <span>{((props.price/10**18) * 60 * 24 * 7).toFixed(8)} <span style={{color:'black', fontSize: 10}}> dai, per week</span></span>
      <span>{((props.price/10**18) * 60 * 24 * 30).toFixed(8)} <span style={{color:'black', fontSize: 10}}> dai, per month</span></span>
      <span>{((props.price/10**18) * 60 * 24 * 180).toFixed(8)} <span style={{color:'black', fontSize: 10}}> dai, per half year</span></span>
      <span>{((props.price/10**18) * 60 * 24 * 360).toFixed(8)} <span style={{color:'black', fontSize: 10}}> dai, per year</span></span>
      <b><p>Rate limit per second:</p></b>
      <span>{props.rateLimit}</span>
      <b><p>Time Interval:</p></b>
      <span>{props.timeInterval}</span>
      <br />
      {props.hasAllowance && <b><p>Choose amount of days to subscribe for:</p></b>}
      <div>
        <div>
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanDay()
          }}>1 day</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanWeek()
          }}>7 days</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanMonth()
          }}>30 days</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanHalfYear()
          }}>180 days</button>}
          {props.hasAllowance && <button className="subscribe" onClick={async () => {
            subscribePlanYear()
          }}>360 days</button>}
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

  const { data: _plansSubscribed } = useContractReads({
    contracts: Array.from({ length: planCount }, (_, i) => ({
      ...yPriceData,
      functionName: 'subscription_end',
      args: [i + 1, address],
    })),
  })

  const { data: _plans } = useContractReads({
    contracts: Array.from({ length: planCount }, (_, i) => ({
      ...yPriceData,
      functionName: 'get_plan',
      args: [i + 1],
    })),
  })

  const dai = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

  const { config: approveConfig } = usePrepareContractWrite({
    address: dai,
    abi: daiABI,
    functionName: 'approve',
    args: [yPriceData.address, MAX_APPROVAL_VALUE],
  })
  const { write: approveDaiSpending } = useContractWrite(approveConfig)

  const { data: allowance } = useContractRead({
    address: dai,
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
        <a target="_blank" href="https://ypriceapi-beta.yearn.finance/docs" rel="noreferrer">documentation</a>
        <a target="_blank" href="https://ypriceapi-beta.yearn.finance/docs" rel="noreferrer">tutorial</a>
        {/* <p style={{fontFamily: 'monospace', color: '#0675F9', backgroundColor: '#eee', fontSize: 16}}>ypriceapi.yearn.farm</p> */}
        <br />
          <>
            {/* <span>
              <ConnectButton showBalance={false} accountStatus="address" />
            </span> */}
            {connected ? <>
              <div className="connect"><ConnectButton showBalance={false} accountStatus="address" /></div>
              <p>
              Use your signed message in requests to yPriceAPI
              </p>
              <button className="sign" onClick={async () => {
                signMessage({message: 'I am proving ownership of this wallet so I can access ypriceAPI.' })
              }}>Sign Wallet Ownership Proof</button>
              {data && (
                <>
                  <h2 className='sig' >Your Signature, use it with every request:</h2>
                  <p>{data}</p>
                  <button className='copy' onClick={() => {
                    navigator.clipboard.writeText(data)
                  }}>Copy</button>
                </>
              )}
            </> : <div className="connect"><ConnectButton showBalance={false} accountStatus="address" /></div>}
            {_plansSubscribed && _plansSubscribed.find(plan => plan !== 0) && <div className="subscribed">
              {_plansSubscribed && _plansSubscribed.map((plan, i) => ([plan * 1000, i + 1])).filter(plan => plan[0] !== 0).map((plan) => (
                  <span key={plan[1]}>
                    <h3>Subscribed to plan {plan[1]}</h3>
                    <p>Expires at {new Date(plan[0]).toLocaleDateString()}</p>
                  </span>
              ))}
            </div>}
            <h2>Available yPriceAPI Plans:</h2>
            {allowance?.toString() === '0' && <button className='approve' onClick={async () => {
              approveDaiSpending()
            }}>Allow DAI Spending</button>}
            {console.log(_plans) || <div className="plans">
              { _plans && _plans.map((plan, i) => ([...plan, i + 1])).filter(plan => plan[5]).map((plan, i) => (
                  <Plan
                    title={plan[0]}
                    price={plan[1].toString()}
                    rateLimit={plan[2].toString()}
                    timeInterval={plan[4].toString()}
                    id={plan[6]}
                    key={plan[6]}
                    hasAllowance={allowance?.toString() !== '0' && connected}
                  />
                ))
              }
              
            </div>}
          </>  
        
        {/* <input type="text" placeholder='address' /> */}
      </main>
    </div>
  );
};

export default Home;

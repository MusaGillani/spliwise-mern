import { asset1, asset2, asset3, asset4 } from '../../assets'

import './homepage.css'

export default function Homepage() {
  const featureDisplayData = [
    {
      bgClass: 'bg-charcoal',
      h1Text: 'Track balances',
      pText: 'Keep track of shared expenses, balances, and who owes who.',
      imgSrc: asset1
    },
    {
      bgClass: 'bg-teal',
      h1Text: 'Organize expenses',
      pText: 'Split expenses with any group: trips, housemates, friends, and family.',
      imgSrc: asset2
    },
    {
      bgClass: 'bg-orange',
      h1Text: 'Add expenses easily',
      pText: 'Quickly add expenses on the go before you forget who paid.',
      imgSrc: asset3
    },
    {
      bgClass: 'bg-charcoal',
      h1Text: 'Pay friends back',
      pText: 'Settle up with a friend and record any cash or online payment.',
      imgSrc: asset4
    }
  ]

  const layout = featureDisplayData.map(({ bgClass, h1Text, pText, imgSrc }, index) => (
    <div className={`feat ${bgClass} flex-column justify-content-between bg-img`} key={index}>
      <h1 className='text-2xl text-center'>{h1Text}</h1>
      <p className='text-center block mx-auto px-8 mt-2 text-lg mb-9 max-w-95'>{pText}</p>
      <img src={imgSrc} className='asset-img ms-auto me-auto' />
    </div>
  ))
  return (
    <div className='body bg-img'>
      <p className='text m-3 mb-4'>
        Less Stress when sharing Expenses <span className='text-teal'>with anyone</span>
      </p>
      <div className='d-flex flex-wrap'>{layout}</div>
    </div>
  )
}

import React from 'react'
import s from './Donate.module.css'
import Title from '../../../common/Title/Title'

function Donate () {
  return (
    <div className={s.donate}>
      <Title>Информация</Title>
      <span>Если вам нравится спамер, вы можете поблагодарить меня:</span>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <iframe
          src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=ucXfoAJgOdU.230324&"
          width="330"
          height="50"
          frameBorder="0"
          allowTransparency={true}
          scrolling="no"
        />
      </div>
      <span>BTC:<br/>bc1q50hwaed60rdfnrenpp4ex0v5mpewskhkma3xy4</span>
      <br/>
      <span>LTC:<br/>ltc1q36ad3jmt3shs40feywzg8gu40q70qktkdz09hz</span>
    </div>
  )
}

export default Donate

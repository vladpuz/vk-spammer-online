import React from 'react'
import s from './Donate.module.css'
import Title from '../../../common/Title/Title'

function Donate () {
  return (
    <div className={s.donate}>
      <Title>Поддержка</Title>
      <iframe
        src="https://money.yandex.ru/quickpay/shop-widget?writer=buyer&targets=&targets-hint=%D0%A7%D1%82%D0%BE%20%D0%B1%D1%8B%20%D0%B2%D1%8B%20%D1%85%D0%BE%D1%82%D0%B5%D0%BB%D0%B8%20%D1%87%D1%82%D0%BE%D0%B1%D1%8B%20%D1%8F%20%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D0%BB%20%D0%B2%20%D1%81%D0%BF%D0%B0%D0%BC%D0%B5%D1%80%3F)&default-sum=50&button-text=11&hint=&successURL=https%3A%2F%2Fvladislav-puzyrev.github.io%2Fvk_spamer_online%2F&quickpay=shop&account=4100110035941487"
        width="100%"
        height="227"
        frameBorder="0"
        scrolling="no"
        title="yandex-money"
      />
    </div>
  )
}

export default Donate

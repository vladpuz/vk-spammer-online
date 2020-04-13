import React from 'react'
import s from './Instructions.module.css'
import attachment from '../../assets/screenshots/attachment.png'
import comments from '../../assets/screenshots/comments.png'
import discussions from '../../assets/screenshots/discussions.png'
import groupsWalls from '../../assets/screenshots/groups-walls.png'
import pm from '../../assets/screenshots/pm.png'
import talks from '../../assets/screenshots/talks.png'
import usersWalls from '../../assets/screenshots/users-walls.png'

function Instructions () {
  return (
    <>
      <h2 className={s.title}>Инструкция по использованию</h2>
      <div className={s.instructions}>
        <ul className={s.list}>
          <li className={s.list__item}>
            <h3 className={s.subtitle}>Адресаты рассылки</h3>
            <ul className={s.addressesList}>
              <li className={s.addressesList__item}>
                <h4 className={s.addressesList__title}>Личные сообщения</h4>
                <p>
                  Здесь поддержвиваются и стандартные и кастомные id пользователей.
                </p>
                <img className={s.screenshot} src={pm} alt="pm"/>
              </li>
              <li className={s.addressesList__item}>
                <h4 className={s.addressesList__title}>Беседы</h4>
                <p>
                  Чтобы получить id беседы откройте её, затем в адресной строке браузера вы увидите её порядковый номер
                  относительно всех бесед в которых вы состоите.
                </p>
                <p>
                  Режим рассылки "беседы с автовыходом" покидает беседу сразу после отправки сообщения, чтобы вас
                  например не исключили.
                </p>
                <img className={s.screenshot} src={talks} alt="talks"/>
              </li>
              <li className={s.addressesList__item}>
                <h4 className={s.addressesList__title}>Стены юзеров</h4>
                <p>
                  Для спама на стены нужен строгий числовой id пользователя. Часто пользователи меняют свой
                  идентификатор с стандартного на кастомный, в таком случае чтобы получить их числовой id мы может
                  открыть например любую фотографию пользователя в которой обязательно будет содержаться его числовой
                  id после слова "photo" до "_".
                </p>
                <img className={s.screenshot} src={usersWalls} alt="usersWalls"/>
              </li>
              <li className={s.addressesList__item}>
                <h4 className={s.addressesList__title}>Стены групп</h4>
                <p>
                  Как и в предыдущем пункте нужен строгий числовой id сообщества. Для того чтобы его получить можно
                  открыть например фотографию сообщества в которой обязательно будет содержаться числовой id группы
                  после слова "photo" до "_".
                </p>
                <img className={s.screenshot} src={groupsWalls} alt="groupsWalls"/>
              </li>
              <li className={s.addressesList__item}>
                <h4 className={s.addressesList__title}>Коментарии</h4>
                <p>
                  Для спама в коментарии вы должны использовать идентификатор записи. Для этого откройте любую запись
                  и скопируйте значение после "wall" до знака "%". Обратите внимание id записей в группах будет всегда
                  начинаться со знака "-", его тоже надо копировать!
                </p>
                <img className={s.screenshot} src={comments} alt="comments"/>
              </li>
              <li className={s.addressesList__item}>
                <h4 className={s.addressesList__title}>Обсуждения</h4>
                <p>
                  Откройте любое обсуждение и скопируйте значение после "topic-".
                </p>
                <img className={s.screenshot} src={discussions} alt="discussions"/>
              </li>
            </ul>
          </li>
          <li className={s.list__item}>
            <h3 className={s.subtitle}>Текст и рандомизация</h3>
            <div>
              <p>
                Заполните текст для рассылки. Это поле может быть пустым если вы указали хотя бы одно вложение в
                следующем шаге. Поддерживаются переносы строк.
              </p>
              <p>
                Для рандомизации сообщения или вложения пишите все варианты в двойных квадратных скобках "[[ ]]" через
                символ "|". Например вот так [[ значение1 | значение2 | значение3 ]]. При отправке текста будет выбрано
                одно из этих значений. Естественно это можно комбинировать с обычным текстом. Например:<br/>
                "Привет. Меня зовут [[ Вася | Стёпа | Артем ]].
                Я живу в [[ Москве | Екатеринбурге | Санкт-Петербурге ]]"
              </p>
              <p>
                Рандомизация помогает снижать вероятность капчи и бана.
              </p>
            </div>
          </li>
          <li className={s.list__item}>
            <h3 className={s.subtitle}>Вложения и рандомизация</h3>
            <div>
              <p>
                Если хотите прикрепите любое вложение, например фотографию. Для этого эта фотография должна уже быть
                залита в ВК. Если она не залита то отправьте её сообщением хоть самому себе и отройте.
                В адресной строке браузера скопируйте текст начиная с photo (может быть video и т.д.) до знака %.
                Можете просто кликнуть 2 раза на слове photo и браузер сам правильно выделит то что нужно.
              </p>
              <img className={s.screenshot} src={attachment} alt="attachment"/>
              <p>
                Важная деталь! Во всех режимах кроме личных сообщений и бесед вложения которые вы прикрепляете должны
                быть публичными! Это означает что вложения должны быть выложены например на открытой стене, альбоме либо
                группе. Если вы пытаетесь прикрепить идентификатор вложения из личного сообщения, оно проигнорируется.
              </p>
              <p>
                Рандомизация вложений работает так же как и текста. используйте двойные квадратные скобки и разделитель
                "|". Например так:<br/>
                [[ photo215249685_457248397 || photo215249685_457248406 ]]
                Переносы строк ни на что не влияют, можете вводить и в две строки.
              </p>
            </div>
          </li>
          <li className={s.list__item}>
            <h3 className={s.subtitle}>Задержка спама</h3>
            <div>
              <p>
                Выставьте задержку между отправкой сообщений. Обратите внимание при низкой задержке (ниже 10с) вконтакте
                довольно быстро блокирует спам проверкой на робота.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Instructions

import { useState } from 'react'
import SakuraPetals from './SakuraPetals'

const HINTS = [
  { key: 'any', label: 'Любой', chip: 'любой аниме-квиз' },
  { key: 'shonen', label: 'Сёнэн', chip: 'сёнэн-квиз' },
  { key: 'shojo', label: 'Сёдзё', chip: 'сёдзё-квиз' },
  { key: 'isekai', label: 'Isekai', chip: 'isekai-квиз' },
  { key: 'classic', label: 'Классика', chip: 'классический квиз' },
  { key: 'movie', label: 'Аниме-фильмы', chip: 'квиз по аниме-фильмам' },
]

function Hero() {
  const [selectedTheme, setSelectedTheme] = useState('any')
  const activeHint = HINTS.find(h => h.key === selectedTheme)

  return (
    <section className="hero">
      <SakuraPetals count={18} />

      <div className="hero__moon" aria-hidden="true"></div>

      <svg
        className="hero__torii"
        viewBox="0 0 100 100"
        aria-hidden="true"
        fill="currentColor"
      >
        {/* верхняя крыша */}
        <path d="M4 10 L96 10 L92 16 L8 16 Z" />
        {/* основная перекладина */}
        <rect x="10" y="16" width="80" height="6" />
        {/* левая стойка */}
        <rect x="18" y="22" width="7" height="72" />
        {/* правая стойка */}
        <rect x="75" y="22" width="7" height="72" />
        {/* средняя перекладина */}
        <rect x="14" y="40" width="72" height="4" />
        {/* центральный столб */}
        <rect x="46" y="22" width="8" height="12" />
      </svg>

      <div className="hero__inner">
        <span className="katakana">アニメ・クイズ</span>
        <h1 className="hero__title">
          Найди свой <span>аниме-квиз</span>
          <br />
          и собери команду мечты
        </h1>
        <p className="hero__subtitle">
          Все аниме-квизы города в одном месте. Выбери тайтл, собери команду и проверь,
          насколько хорошо ты знаешь любимую вселенную.
        </p>

        <div className="builder" aria-label="Конструктор поиска квиза">
          <div className="builder__display">
            <span>Хочу найти</span>
            <span className="builder__chip">{activeHint.chip} ✕</span>
            <span>в</span>
            <span className="builder__chip">Москве ✕</span>
            <span>на</span>
            <span className="builder__chip">ближайшие дни ✕</span>
            <span className="builder__caret" aria-hidden="true"></span>
          </div>

          <div className="builder__hints">
            {HINTS.map(hint => (
              <button
                key={hint.key}
                className={`builder__hint ${selectedTheme === hint.key ? 'builder__hint--active' : ''}`}
                onClick={() => setSelectedTheme(hint.key)}
              >
                {hint.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
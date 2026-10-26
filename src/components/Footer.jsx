function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <h4>AniQuiz</h4>
          <a href="#">О проекте</a>
          <a href="#">Стать организатором</a>
          <a href="#">Контакты</a>
        </div>
        <div className="footer__col">
          <h4>Игрокам</h4>
          <a href="#">Все квизы</a>
          <a href="#">Личный кабинет</a>
          <a href="#">История участия</a>
        </div>
        <div className="footer__col">
          <h4>Города</h4>
          <a href="#">Москва</a>
          <a href="#">Санкт-Петербург</a>
          <a href="#">Екатеринбург</a>
        </div>
        <div className="footer__copy">
          © 2026 AniQuiz — пет-проект. Все тайтлы принадлежат их правообладателям.
        </div>
      </div>
    </footer>
  )
}

export default Footer
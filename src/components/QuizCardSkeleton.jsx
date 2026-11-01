import Skeleton from './Skeleton'

function QuizCardSkeleton() {
  return (
    <article className="card">
      <div className="card__cover skeleton" aria-hidden="true" />
      <div className="card__body">
        <Skeleton height="20px" width="85%" />
        <Skeleton height="14px" width="100%" />
        <Skeleton height="14px" width="60%" />
        <div className="card__tags">
          <Skeleton width="60px" height="20px" radius="3px" />
          <Skeleton width="80px" height="20px" radius="3px" />
          <Skeleton width="70px" height="20px" radius="3px" />
        </div>
        <div className="card__meta">
          <Skeleton height="14px" width="70%" />
          <Skeleton height="14px" width="85%" />
        </div>
        <div className="card__footer">
          <Skeleton width="60px" height="20px" />
          <Skeleton width="110px" height="36px" radius="var(--radius-sm)" />
        </div>
      </div>
    </article>
  )
}

export default QuizCardSkeleton
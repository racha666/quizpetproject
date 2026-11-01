import Skeleton from './Skeleton'

function ParticipationCardSkeleton() {
  return (
    <article className="participation-card">
      <header className="participation-card__header">
        <Skeleton width="70%" height="20px" />
        <Skeleton width="100px" height="26px" radius="4px" />
      </header>
      <div className="participation-card__meta">
        <Skeleton height="14px" width="55%" />
        <Skeleton height="14px" width="65%" />
        <Skeleton height="14px" width="60%" />
      </div>
      <div className="participation-card__team">
        <Skeleton height="16px" width="45%" />
      </div>
      <Skeleton height="28px" width="100%" />
    </article>
  )
}

export default ParticipationCardSkeleton
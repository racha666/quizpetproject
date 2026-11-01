import Skeleton from './Skeleton'

function TeamCardSkeleton() {
  return (
    <article className="team-card">
      <div className="team-card__header">
        <Skeleton width="140px" height="20px" />
        <Skeleton width="28px" height="28px" radius="4px" />
      </div>
      <div className="team-card__stats">
        <Skeleton width="180px" height="14px" />
      </div>
      <div className="team-card__captains">
        <Skeleton width="90%" height="22px" />
      </div>
      <div className="team-card__actions">
        <Skeleton height="34px" radius="var(--radius-sm)" />
        <Skeleton height="34px" radius="var(--radius-sm)" />
      </div>
    </article>
  )
}

export default TeamCardSkeleton
import Skeleton from './Skeleton'

function PlansTabSkeleton() {
  return (
    <article className="team-card">
      <div className="team-card__header">
        <Skeleton width="140px" height="20px" />
      </div>
      <div className="team-card__stats">
        <Skeleton width="80px" height="14px" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton height="14px" width="90%" />
        <Skeleton height="14px" width="80%" />
        <Skeleton height="14px" width="70%" />
      </div>
    </article>
  )
}

export default PlansTabSkeleton
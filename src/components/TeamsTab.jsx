import { useState, useEffect } from 'react'
import TeamCard from './TeamCard'
import TeamForm from './TeamForm'
import ConfirmDialog from './ConfirmDialog'
import { fetchTeams, createTeam, updateTeam, deleteTeam } from '../api/teams'
import TeamCardSkeleton from './TeamCardSkeleton'

function TeamsTab() {
  const [teams, setTeams] = useState([])
  const [loadStatus, setLoadStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [loadError, setLoadError] = useState('')

  const [view, setView] = useState('list') // 'list' | 'form' | 'delete'
  const [editingTeam, setEditingTeam] = useState(null) // null = create
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  const [submitStatus, setSubmitStatus] = useState('idle') // 'idle' | 'saving'
  const [serverError, setServerError] = useState('')
  const [deleteStatus, setDeleteStatus] = useState('idle')

  // Загрузка при монтировании
  useEffect(() => {
    loadTeams()
  }, [])

  async function loadTeams() {
    setLoadStatus('loading')
    setLoadError('')
    try {
      const data = await fetchTeams()
      setTeams(data)
      setLoadStatus('success')
    } catch (err) {
      setLoadError(err.message || 'Не удалось загрузить команды')
      setLoadStatus('error')
    }
  }

  function openCreate() {
    setEditingTeam(null)
    setServerError('')
    setView('form')
  }

  function openEdit(team) {
    setEditingTeam(team)
    setServerError('')
    setView('form')
  }

  function openDelete(team) {
    setDeleteCandidate(team)
    setView('delete')
  }

  function closeForm() {
    if (submitStatus === 'saving') return
    setView('list')
    setEditingTeam(null)
    setServerError('')
  }

  function closeDelete() {
    if (deleteStatus === 'deleting') return
    setView('list')
    setDeleteCandidate(null)
  }

  async function handleSubmitForm(data) {
    setSubmitStatus('saving')
    setServerError('')
    try {
      if (editingTeam) {
        const updated = await updateTeam(editingTeam.id, data)
        setTeams(prev => prev.map(t => (t.id === updated.id ? updated : t)))
      } else {
        const created = await createTeam(data)
        setTeams(prev => [...prev, created])
      }
      setView('list')
      setEditingTeam(null)
    } catch (err) {
      setServerError(err.message || 'Не удалось сохранить команду')
    } finally {
      setSubmitStatus('idle')
    }
  }

  async function handleConfirmDelete() {
    if (!deleteCandidate) return
    setDeleteStatus('deleting')
    try {
      await deleteTeam(deleteCandidate.id)
      setTeams(prev => prev.filter(t => t.id !== deleteCandidate.id))
      setView('list')
      setDeleteCandidate(null)
    } catch (err) {
      setServerError(err.message || 'Не удалось удалить команду')
    } finally {
      setDeleteStatus('idle')
    }
  }

  // ===== Loading =====
  if (loadStatus === 'loading') {
    return (
      <div>
        <div className="teams-header">
          <div>
            <h3 className="teams-header__title">Мои команды</h3>
            <p className="teams-header__subtitle">Загрузка...</p>
          </div>
        </div>
       <div className="teams-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // ===== Error =====
  if (loadStatus === 'error') {
    return (
      <div>
        <div className="error-banner">
          <strong>Ошибка загрузки</strong>
          {loadError}
        </div>
        <button className="btn btn--ghost" type="button" onClick={loadTeams}>
          Попробовать снова
        </button>
      </div>
    )
  }

  // ===== Delete confirmation =====
  if (view === 'delete' && deleteCandidate) {
    return (
      <ConfirmDialog
        title="Удалить команду?"
        message={`Команда «${deleteCandidate.name}» будет удалена без возможности восстановления.`}
        confirmLabel="Удалить"
        onConfirm={handleConfirmDelete}
        onCancel={closeDelete}
        isDanger
        isLoading={deleteStatus === 'deleting'}
      />
    )
  }

  // ===== Form (create / edit) =====
  if (view === 'form') {
    return (
      <TeamForm
        initialTeam={editingTeam}
        onSubmit={handleSubmitForm}
        onCancel={closeForm}
        isSubmitting={submitStatus === 'saving'}
        serverError={serverError}
      />
    )
  }

  // ===== List =====
  return (
    <div>
      <div className="teams-header">
        <div>
          <h3 className="teams-header__title">Мои команды</h3>
          <p className="teams-header__subtitle">
            {teams.length === 0
              ? 'У вас пока нет команд'
              : `${teams.length} команд(ы)`}
          </p>
        </div>
        <button className="btn btn--primary" type="button" onClick={openCreate}>
          + Создать команду
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="teams-empty">
          <p>Вы пока не состоите ни в одной команде.</p>
          <button className="btn btn--primary" type="button" onClick={openCreate}>
            Создать первую команду
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamsTab
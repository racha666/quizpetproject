import { useState, useEffect } from 'react'
import TemplateCard from './TemplateCard'
import TemplateForm from './TemplateForm'
import ConfirmDialog from './ConfirmDialog'
import { fetchTemplates, createTemplate, updateTemplate, deleteTemplate } from '../api/templates'
import { fetchTeams } from '../api/teams'

function TemplatesTab() {
  const [templates, setTemplates] = useState([])
  const [teams, setTeams] = useState([])
  const [loadStatus, setLoadStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [loadError, setLoadError] = useState('')

  const [view, setView] = useState('list') // 'list' | 'form' | 'delete'
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  const [submitStatus, setSubmitStatus] = useState('idle')
  const [serverError, setServerError] = useState('')
  const [deleteStatus, setDeleteStatus] = useState('idle')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoadStatus('loading')
    setLoadError('')
    try {
      const [templatesData, teamsData] = await Promise.all([
        fetchTemplates(),
        fetchTeams(),
      ])
      setTemplates(templatesData)
      setTeams(teamsData)
      setLoadStatus('success')
    } catch (err) {
      setLoadError(err.message || 'Не удалось загрузить шаблоны')
      setLoadStatus('error')
    }
  }

  function openCreate() {
    setEditingTemplate(null)
    setServerError('')
    setView('form')
  }

  function openEdit(template) {
    setEditingTemplate(template)
    setServerError('')
    setView('form')
  }

  function openDelete(template) {
    setDeleteCandidate(template)
    setView('delete')
  }

  function closeForm() {
    if (submitStatus === 'saving') return
    setView('list')
    setEditingTemplate(null)
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
      if (editingTemplate) {
        const updated = await updateTemplate(editingTemplate.id, data)
        setTemplates(prev => prev.map(t => (t.id === updated.id ? updated : t)))
      } else {
        const created = await createTemplate(data)
        setTemplates(prev => [...prev, created])
      }
      setView('list')
      setEditingTemplate(null)
    } catch (err) {
      setServerError(err.message || 'Не удалось сохранить шаблон')
    } finally {
      setSubmitStatus('idle')
    }
  }

  async function handleConfirmDelete() {
    if (!deleteCandidate) return
    setDeleteStatus('deleting')
    try {
      await deleteTemplate(deleteCandidate.id)
      setTemplates(prev => prev.filter(t => t.id !== deleteCandidate.id))
      setView('list')
      setDeleteCandidate(null)
    } catch (err) {
      setServerError(err.message || 'Не удалось удалить шаблон')
    } finally {
      setDeleteStatus('idle')
    }
  }

  if (loadStatus === 'loading') {
    return (
      <div className="teams-loading">
        <span className="btn__spinner" aria-hidden="true"></span>
        Загружаем шаблоны...
      </div>
    )
  }

  if (loadStatus === 'error') {
    return (
      <div>
        <div className="error-banner">
          <strong>Ошибка загрузки</strong>
          {loadError}
        </div>
        <button className="btn btn--ghost" type="button" onClick={loadData}>
          Попробовать снова
        </button>
      </div>
    )
  }

  if (view === 'delete' && deleteCandidate) {
    return (
      <ConfirmDialog
        title="Удалить шаблон?"
        message={`Шаблон «${deleteCandidate.name}» будет удалён без возможности восстановления.`}
        confirmLabel="Удалить"
        onConfirm={handleConfirmDelete}
        onCancel={closeDelete}
        isDanger
        isLoading={deleteStatus === 'deleting'}
      />
    )
  }

  if (view === 'form') {
    return (
      <TemplateForm
        initialTemplate={editingTemplate}
        teams={teams}
        onSubmit={handleSubmitForm}
        onCancel={closeForm}
        isSubmitting={submitStatus === 'saving'}
        serverError={serverError}
      />
    )
  }

  return (
    <div>
      <div className="teams-header">
        <div>
          <h3 className="teams-header__title">Шаблоны регистрации</h3>
          <p className="teams-header__subtitle">
            {templates.length === 0
              ? 'У вас пока нет шаблонов'
              : `${templates.length} шаблон(ов)`}
          </p>
        </div>
        <button className="btn btn--primary" type="button" onClick={openCreate}>
          + Создать шаблон
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="teams-empty">
          <p>Шаблоны позволяют не вводить одни и те же данные каждый раз.</p>
          <button className="btn btn--primary" type="button" onClick={openCreate}>
            Создать первый шаблон
          </button>
        </div>
      ) : (
        <div className="templates-grid">
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              teams={teams}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplatesTab
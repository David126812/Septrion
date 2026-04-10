import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.posthog.com'

export function initPostHog() {
  if (!POSTHOG_KEY) return
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: true,
    capture_pageview: true,
    persistence: 'localStorage',
  })
}

export function identifyUser(userId: string, coproName?: string) {
  if (!POSTHOG_KEY) return
  posthog.identify(userId)
  if (coproName) {
    posthog.group('copro', coproName)
  }
}

// Custom events per project-context spec
export function trackSignalementQualified(dossierId: string) {
  posthog.capture('signalement_qualified', { dossier_id: dossierId })
}

export function trackDossierViewed(dossierId: string) {
  posthog.capture('dossier_viewed', { dossier_id: dossierId })
}

export function trackNotificationSent(type: string) {
  posthog.capture('notification_sent', { type })
}

export function trackDocumentUploaded(mimeType: string) {
  posthog.capture('document_uploaded', { mime_type: mimeType })
}

export function trackDigestClicked() {
  posthog.capture('digest_clicked')
}

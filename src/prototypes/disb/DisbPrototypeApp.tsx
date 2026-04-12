import { lazy, Suspense } from 'react'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@disb/components/ui/tooltip'
import './disburse-ph.css'

const DashboardPage = lazy(() => import('./routes/DashboardPage'))
const NewDisbursementPage = lazy(() => import('./routes/NewDisbursementPage'))
const DisbursementDetailPage = lazy(() => import('./routes/DisbursementDetailPage'))
const RecipientsPage = lazy(() => import('./routes/RecipientsPage'))
const SchedulePage = lazy(() => import('./routes/SchedulePage'))
const HistoryPage = lazy(() => import('./routes/HistoryPage'))
const SettingsPage = lazy(() => import('./routes/SettingsPage'))

function PrototypeFallback() {
  return (
    <div className="flex min-h-[28rem] items-center justify-center bg-background text-sm text-muted-foreground">
      Loading prototype…
    </div>
  )
}

export function DisbPrototypeApp() {
  return (
    <div className="disb-prototype pm-disb-shell overflow-hidden rounded-2xl border border-sidebar-border shadow-[0_8px_40px_color-mix(in_srgb,var(--foreground)_8%,transparent)]">
      <TooltipProvider>
        <MemoryRouter initialEntries={['/dashboard']} initialIndex={0}>
          <Suspense fallback={<PrototypeFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/disbursements/new" element={<NewDisbursementPage />} />
              <Route path="/disbursements/:id" element={<DisbursementDetailPage />} />
              <Route path="/recipients" element={<RecipientsPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </MemoryRouter>
        <Toaster richColors />
      </TooltipProvider>
    </div>
  )
}

/// <reference types="vite/client" />

import { ComputedRef } from 'vue'

declare const useToast: () => {
  toasts: ComputedRef<ToasterToast[]>
  toast: (props: Toast) => {
    id: string
    dismiss: (toastId?: string) => void
    update: (props: ToasterToast) => void
  }
  dismiss: (toastId?: string) => void
}

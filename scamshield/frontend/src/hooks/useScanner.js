import { useMutation } from '@tanstack/react-query'
import { scanMessage, scanUrl } from '../services/scannerApi.js'

export function useMessageScanner() {
  return useMutation({
    mutationFn: scanMessage,
  })
}

export function useUrlScanner() {
  return useMutation({
    mutationFn: scanUrl,
  })
}


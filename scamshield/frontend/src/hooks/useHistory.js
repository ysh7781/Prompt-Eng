import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHistory, getScanDetail, deleteScan } from '../services/historyApi.js'

export function useHistory(params) {
  return useQuery({
    queryKey: ['history', params],
    queryFn: () => getHistory(params).then((r) => r.data),
  })
}

export function useScanDetail(id) {
  return useQuery({
    queryKey: ['history', 'detail', id],
    queryFn: () => getScanDetail(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useDeleteScan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteScan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })
}


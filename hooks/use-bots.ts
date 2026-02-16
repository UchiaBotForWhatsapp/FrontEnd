import useSWR from "swr"
import { botApi } from "@/lib/api-client"

function extractBotsList(payload: any): any[] {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.bots)) return payload.bots
  if (Array.isArray(payload?.data?.bots)) return payload.data.bots
  return []
}

function extractBotItem(payload: any): any {
  if (!payload) return payload
  return payload?.data?.bot ?? payload?.data ?? payload?.bot ?? payload
}

export function useBots() {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR("/bots", () => botApi.list(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const bots = extractBotsList(data)

  const createBot = async (data: any) => {
    const response = await botApi.create(data)
    const newBot = extractBotItem(response)
    mutate((prev: any) => [...extractBotsList(prev), newBot], false)
    return newBot
  }

  const updateBot = async (id: string, data: any) => {
    const response = await botApi.update(id, data)
    const updated = extractBotItem(response)
    mutate(
      (prev: any) =>
        extractBotsList(prev).map((bot: any) => (bot._id === id ? updated : bot)),
      false,
    )
    return updated
  }

  const deleteBot = async (id: string) => {
    await botApi.delete(id)
    mutate((prev: any) => extractBotsList(prev).filter((bot: any) => bot._id !== id), false)
  }

  const toggleBot = async (id: string) => {
    const response = await botApi.toggle(id)
    const updated = extractBotItem(response)
    mutate(
      (prev: any) =>
        extractBotsList(prev).map((bot: any) => (bot._id === id ? updated : bot)),
      false,
    )
    return updated
  }


  return {
    bots,
    isLoading,
    error,
    createBot,
    updateBot,
    deleteBot,
    toggleBot,
  }
}

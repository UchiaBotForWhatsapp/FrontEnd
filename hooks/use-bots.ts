import useSWR from "swr"
import { botApi } from "@/lib/api-client"

export function useBots() {
  const {
    data: bots,
    error,
    isLoading,
    mutate,
  } = useSWR("/bots", () => botApi.list(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const createBot = async (data: any) => {
    const newBot = await botApi.create(data)
    mutate((prev: any) => [...(prev || []), newBot], false)
    return newBot
  }

  const updateBot = async (id: string, data: any) => {
    const updated = await botApi.update(id, data)
    mutate((prev: any) => prev?.map((bot: any) => (bot.id === id ? updated : bot)), false)
    return updated
  }

  const deleteBot = async (id: string) => {
    await botApi.delete(id)
    mutate((prev: any) => prev?.filter((bot: any) => bot.id !== id), false)
  }

  const toggleBot = async (id: string) => {
  const updated = await botApi.toggle(id)
  mutate((prev: any) =>
    prev?.map((bot: any) =>
      bot._id === id ? updated : bot 
    ),
    false
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

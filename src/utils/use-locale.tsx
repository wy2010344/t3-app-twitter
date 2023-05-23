import { useTranslation } from "next-i18next";

export function useLocale(
  namespace: Parameters<typeof useTranslation>[0] = "common"
) {
  return useTranslation(namespace)
}
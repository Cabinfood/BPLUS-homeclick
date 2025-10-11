import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "de-DE", // Changed to use . for thousands and , for decimals
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)

  // Move currency symbol to after the number
  // Match currency symbol at the beginning (with optional space)
  const symbolAtStart = formatted.match(/^([^\d\s]+)\s?(.+)$/)
  if (symbolAtStart) {
    const [, symbol, number] = symbolAtStart
    return `${number} ${symbol}`
  }

  // If symbol is already at the end or no symbol found, return as is
  return formatted
}

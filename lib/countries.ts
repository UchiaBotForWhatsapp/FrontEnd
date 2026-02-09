export interface Country {
  name: string;
  code: string;
  flag: string;
  ddi: string;
}

export const countries: Country[] = [
  { name: "Angola", code: "AO", flag: "🇦🇴", ddi: "+244" },
  { name: "Argentina", code: "AR", flag: "🇦🇷", ddi: "+54" },
  { name: "Brasil", code: "BR", flag: "🇧🇷", ddi: "+55" },
  { name: "Cabo Verde", code: "CV", flag: "🇨🇻", ddi: "+238" },
  { name: "Canadá", code: "CA", flag: "🇨🇦", ddi: "+1" },
  { name: "Chile", code: "CL", flag: "🇨🇱", ddi: "+56" },
  { name: "China", code: "CN", flag: "🇨🇳", ddi: "+86" },
  { name: "Colômbia", code: "CO", flag: "🇨🇴", ddi: "+57" },
  { name: "Espanha", code: "ES", flag: "🇪🇸", ddi: "+34" },
  { name: "Estados Unidos", code: "US", flag: "🇺🇸", ddi: "+1" },
  { name: "França", code: "FR", flag: "🇫🇷", ddi: "+33" },
  { name: "Guiné-Bissau", code: "GW", flag: "🇬🇼", ddi: "+245" },
  { name: "Índia", code: "IN", flag: "🇮🇳", ddi: "+91" },
  { name: "Itália", code: "IT", flag: "🇮🇹", ddi: "+39" },
  { name: "Japão", code: "JP", flag: "🇯🇵", ddi: "+81" },
  { name: "México", code: "MX", flag: "🇲🇽", ddi: "+52" },
  { name: "Moçambique", code: "MZ", flag: "🇲🇿", ddi: "+258" },
  { name: "Portugal", code: "PT", flag: "🇵🇹", ddi: "+351" },
  { name: "Reino Unido", code: "GB", flag: "🇬🇧", ddi: "+44" },
  { name: "São Tomé e Príncipe", code: "ST", flag: "🇸🇹", ddi: "+239" },
  { name: "África do Sul", code: "ZA", flag: "🇿🇦", ddi: "+27" },
  { name: "Alemanha", code: "DE", flag: "🇩🇪", ddi: "+49" },
  { name: "Austrália", code: "AU", flag: "🇦🇺", ddi: "+61" },
  { name: "Bélgica", code: "BE", flag: "🇧🇪", ddi: "+32" },
  { name: "Holanda", code: "NL", flag: "🇳🇱", ddi: "+31" },
  { name: "Suíça", code: "CH", flag: "🇨🇭", ddi: "+41" },
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Get country by code
 */
export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}

/**
 * Get country by name
 */
export function getCountryByName(name: string): Country | undefined {
  return countries.find((c) => c.name === name);
}

/**
 * Format phone number with DDI
 */
export function formatPhoneWithDDI(ddi: string, phoneNumber: string): string {
  // Remove any non-digit characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  return `${ddi}${cleanPhone}`;
}

/**
 * Validate phone number (only digits allowed)
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^\d+$/.test(phone);
}

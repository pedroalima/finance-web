// Função para formatar data (AAAA-MM-DD)
export const formatDate = (value: string | Date) => {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toLocaleDateString("pt-BR"); // dd/mm/yyyy
  }

  const onlyNums = value.replace(/\D/g, "");
  if (onlyNums.length <= 2) return onlyNums; // dia
  if (onlyNums.length <= 4) {
    return onlyNums.replace(/(\d{2})(\d{1,2})/, "$1/$2"); // dia/mes
  }
  return onlyNums.replace(/(\d{2})(\d{2})(\d{1,2})/, "$1/$2/$3"); // dia/mes/ano
};

// Converte "DD/MM/AA" → "AAAA-MM-DD"
export const formatDateToApi = (value: string | Date) => {
  if (!value) return "";

  let dateObj: Date;

  if (value instanceof Date) {
    dateObj = value;
  } else {
    // Se vier no formato dd/mm/yyyy ou similar
    const [day, month, year] = value.split("/");
    dateObj = new Date(+year, +month - 1, +day);
  }

  // Formata para yyyy-mm-dd
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateToFront = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
};

// Função para formatar moeda
export const formatCurrency = (value: string) => {
  if (!value) return "";
  // Remove tudo que não for número
  const onlyNums = value.replace(/\D/g, "");
  // Divide por 100 para ter duas casas decimais
  const num = (parseInt(onlyNums, 10) / 100).toFixed(2);
  // Substitui ponto por vírgula e adiciona prefixo R$
  return "R$ " + num.replace(".", ",");
};

export const parseCurrencyToNumber = (value: string | number) => {
  if (typeof value === "number") return value;
  return Number(value.replace(/[^\d,-]/g, "").replace(",", "."));
};

export const generateMonths = (yearsBack = 1) => {
  const now = new Date();
  const result = [];

  for (let y = yearsBack - 1; y >= 0; y--) {
    const year = now.getFullYear() - y;
    for (let m = 0; m < 12; m++) {
      const month = String(m + 1).padStart(2, "0"); // 01, 02, ...
      const yearShort = String(year).slice(-2); // 24, 25
      result.push({
        month: m + 1,
        year,
        label: `${month}/${yearShort}`,
      });
    }
  }

  return result;
};

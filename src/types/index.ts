export interface Account {
  id: string;
  name: string;
  balanceEur: number;
  cardNumber: string | null;
  cardExpiry: string | null;
  cardCvv: string | null;
  cardNetwork: string | null;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amountEur: number;
  amountUsdt: number;
  type: "income" | "expense" | "yield";
}

export interface AtmWithdrawal {
  id: string;
  accountId: string;
  amount: number;
  pickupDate: string;
  status: string;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ParsedTransaction {
  date: string;
  description: string;
  amountEur: number;
  type: "income" | "expense" | "yield";
}

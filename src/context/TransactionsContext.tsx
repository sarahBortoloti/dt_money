import { ReactNode, useEffect, useState, useCallback } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

// Igualdade referencial

type TransactionProps = {
  id: string | number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

type NewTransactionFormInputsProps = {
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
}

interface TransactionContextType {
  transactions: TransactionProps[]
  fetchTransactions: (query?: string) => Promise<void>
  createdNewTransaction: (data: NewTransactionFormInputsProps) => void
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }, []);

  const createdNewTransaction = useCallback(
    async (data: NewTransactionFormInputsProps) => {
      const { description, category, price, type } = data;
      const response = await api.post("transactions", {
        description,
        category,
        price,
        type,
        createdAt: new Date(),
      });

      // quando for fazer uma atualização de um estado que depende do valor anterior é melhor fazer utilizando um callback
      setTransactions((state) => [response.data, ...state]);
    },
    []
  );


  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createdNewTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

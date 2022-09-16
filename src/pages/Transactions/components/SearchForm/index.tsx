import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { SearchFormContainer } from './styles'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../../../context/TransactionsContext'
import { useContextSelector } from 'use-context-selector'
import { memo } from 'react'


/*
* Porque um componente renderiza?
* - Hooks changed (mudou estado, contexto, reducer)
* - Props changed (mudou propriedades)
* - Parent rerendered ( componente pai rendezirou)

** Qual o fluxo de renderização?
** 1. React recria o html da interface daquele componente
** 2. Compara a versão do HTML recriada com a versão anterior
** 3. Se mudou alguma coisa, rescreve o html na tela

* Memo:
* 0. Hooks changed, Props changed (deep comparation)
** comparação + lenta 
** usa em condicionais / listas
* 1.Comparar a versão anterior dos hooks e props
* 2. Se mudou algo, ele vai permitir a nova renderização
*/


const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormInputs = z.infer<typeof searchFormSchema>

const SearchFormComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  })

  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions
    },
  )

  async function handleSearchTransactions(data: SearchFormInputs) {
    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por uma transação"
        {...register('query')}
      />
      <button disabled={isSubmitting}>
        Buscar
        <MagnifyingGlass size={20} />
      </button>
    </SearchFormContainer>
  )
}

export const SearchForm = memo(SearchFormComponent);
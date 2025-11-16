import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { createRecipe } from '../../api/recipes.js'
import { IngredientBuilder } from './IngredientBuilder.jsx.jsx'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [ingredientAmounts, setIngredientAmounts] = useState([])
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe(token, { title, ingredientAmounts, instructions }),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }
  if (!token) return <div>Please log in to create new recipes.</div>
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <br />
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <section>
        <IngredientBuilder onChange={setIngredientAmounts} />
        <br />
        <label htmlFor='create-instructions'>Instructions:</label>
        <br />
        <textarea
          id='create-instructions'
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </section>
      <br />
      <br />
      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating....' : 'Create'}
        disabled={!title}
      />
      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe posted successfully!
        </>
      ) : null}
    </form>
  )
}

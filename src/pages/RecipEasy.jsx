import { RecipeList } from '../components/Recipes/RecipeList.jsx'
import { CreateRecipe } from '../components/Recipes/CreateRecipe.jsx'
import { RecipeFilter } from '../components/Recipes/RecipeFilter.jsx'
import { RecipeSorting } from '../components/Recipes/RecipeSorting.jsx'
import { Helmet } from 'react-helmet-async'
import { Header } from '../components/Header.jsx'
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { GET_RECIPES, GET_RECIPES_BY_AUTHOR } from '../api/graphql/recipes.js'
import { useState } from 'react'

export function RecipEasy() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  // const recipeQuery = useQuery({
  //   queryKey: ['recipes', { author, sortBy, sortOrder }],
  //   queryFn: () => getRecipes({ author, sortBy, sortOrder }),
  // })
  // const recipes = recipeQuery.data ?? []

  const recipeQuery = useGraphQLQuery(
    author ? GET_RECIPES_BY_AUTHOR : GET_RECIPES,
    {
      variables: { options: { sortBy, sortOrder } },
    },
  )

  const recipes =
    recipeQuery.data?.recipesByAuthor ?? recipeQuery.data?.recipes ?? []

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>RecipEasy</title>
        <meta name='description' content='A collection of recipes.' />
      </Helmet>
      <h1>RecipEasy!</h1>
      <Header />
      <br />
      <hr />
      <CreateRecipe />
      <br />
      <hr />
      Filter by:
      <RecipeFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <RecipeSorting
        fields={['createdAt', 'updatedAt', 'likes']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <RecipeList recipes={recipes} />
    </div>
  )
}

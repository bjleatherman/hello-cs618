import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Recipe } from '../components/Recipes/Recipe.jsx'
import { getRecipeById } from '../api/recipes.js'
import { PostStats } from '../components/PostStats.jsx'
import { useEffect, useState } from 'react'
import { postTrackEvent } from '../api/events.js'
import { getUserInfo } from '../api/users.js'
import { Helmet } from 'react-helmet-async'

export function ViewRecipe({ recipeId }) {
  const [session, setSession] = useState()

  // Track view duration (backend expects "postId", even for recipes)
  const trackEventMutation = useMutation({
    mutationFn: (action) =>
      postTrackEvent({ postId: recipeId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })

  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)

    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])

  // Fetch recipe
  const recipeQuery = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
  })

  const recipe = recipeQuery.data

  // Fetch author info
  const userInfoQuery = useQuery({
    queryKey: ['users', recipe?.author],
    queryFn: () => getUserInfo(recipe?.author),
    enabled: Boolean(recipe?.author),
  })

  const userInfo = userInfoQuery.data

  function truncate(str, max = 160) {
    if (!str) return str
    return str.length > max ? str.slice(0, max - 3) + '...' : str
  }

  return (
    <div style={{ padding: 8 }}>
      {recipe && (
        <Helmet>
          <title>{recipe.title} | RecipEasy</title>

          <meta name='description' content={truncate(recipe.instructions)} />

          <meta property='og:type' content='article' />
          <meta property='og:title' content={recipe.title} />
          <meta
            property='og:article:published_time'
            content={recipe.createdAt}
          />
          <meta
            property='og:article:modified_time'
            content={recipe.updatedAt}
          />

          {userInfo?.username && (
            <meta property='og:article:author' content={userInfo.username} />
          )}

          {(recipe.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}

      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />

      {recipe ? (
        <div>
          <Recipe
            {...recipe}
            id={recipeId}
            fullPost
            author={userInfo?.username ? userInfo : undefined}
          />

          <hr />
          <PostStats postId={recipeId} />
        </div>
      ) : (
        `Recipe with id ${recipeId} not found.`
      )}
    </div>
  )
}

ViewRecipe.propTypes = {
  recipeId: PropTypes.string.isRequired,
}

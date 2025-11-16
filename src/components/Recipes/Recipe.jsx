import PropTypes from 'prop-types'
import { User } from '../User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import {
  LIKE_RECIPE,
  GET_RECIPES,
  GET_RECIPES_BY_AUTHOR,
} from '../../api/graphql/recipes.js'

export function Recipe({
  title,
  ingredientAmounts = [],
  instructions,
  author,
  id,
  likes = 0,
  fullPost = false,
}) {
  const [token] = useAuth()
  const isLoggedIn = Boolean(token)

  // local optimistic likes
  const [localLikes, setLocalLikes] = useState(likes)
  useEffect(() => {
    setLocalLikes(likes)
  }, [likes])

  const [likeRecipeMutation, { loading }] = useGraphQLMutation(LIKE_RECIPE, {
    variables: { id },
    context: { headers: { Authorization: `Bearer ${token}` } },
    // same trick as CreatePost: tell Apollo to refetch recipe lists
    refetchQueries: [GET_RECIPES, GET_RECIPES_BY_AUTHOR],
  })

  const handleLike = () => {
    if (!isLoggedIn || loading) return

    // optimistic bump
    setLocalLikes((prev) => prev + 1)

    likeRecipeMutation().catch(() => {
      // roll back if the mutation fails
      setLocalLikes((prev) => Math.max(prev - 1, 0))
    })
  }

  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/recipes/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}

      {/* Ingredients list */}
      {ingredientAmounts.length > 0 && (
        <section>
          <h4>Ingredients</h4>
          <ul>
            {ingredientAmounts.map((ia, idx) => (
              <li key={idx}>
                {ia.ingredient} | {ia.amountQuantity} {ia.amountUnit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Instructions */}
      {instructions && (
        <section>
          <h4>Instructions</h4>
          <p>{instructions}</p>
        </section>
      )}

      {/* Author attribution */}
      {author && (
        <em>
          <br />
          Recipe by <User {...author} />
        </em>
      )}

      {/* Likes */}
      <p>Likes: {localLikes}</p>

      {/* Like button — only if logged in */}
      {isLoggedIn ? (
        <button onClick={handleLike} disabled={loading}>
          {loading ? 'Liking...' : '👍'}
        </button>
      ) : (
        <p>
          <i>Log in to like this recipe</i>
        </p>
      )}
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredientAmounts: PropTypes.arrayOf(
    PropTypes.shape({
      ingredient: PropTypes.string.isRequired,
      amountQuantity: PropTypes.number.isRequired,
      amountUnit: PropTypes.string.isRequired,
    }),
  ),
  instructions: PropTypes.string,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  id: PropTypes.string.isRequired,
  likes: PropTypes.number,
  fullPost: PropTypes.bool,
}

/* eslint-disable react/prop-types */ // keep ESLint from blocking on prop-types for this file
import { useState } from 'react'

export function IngredientBuilder({ onChange }) {
  const emptyRow = { ingredient: '', amountQuantity: '', amountUnit: '' }
  const [rows, setRows] = useState([{ ...emptyRow }])
  const [errors, setErrors] = useState({})

  const validate = (list) => {
    const nextErrors = {}
    list.forEach((r, i) => {
      const filled = !!(r.ingredient || r.amountQuantity || r.amountUnit)
      const complete = !!(r.ingredient && r.amountQuantity && r.amountUnit)
      nextErrors[i] = filled && !complete // error on partial row
    })
    setErrors(nextErrors)
  }

  const emit = (list) => {
    const tuples = list
      .filter((r) => r.ingredient && r.amountQuantity && r.amountUnit)
      .map((r) => ({
        ingredient: r.ingredient.trim(),
        amountQuantity: Number(r.amountQuantity),
        amountUnit: r.amountUnit.trim(),
      }))
    onChange?.(tuples)
  }

  const handleChange = (i, field, val) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [field]: val } : r))
    setRows(next)
    validate(next)
    emit(next)
  }

  const addRow = () => {
    const next = [...rows, { ...emptyRow }]
    setRows(next)
    validate(next)
    emit(next)
  }

  const removeRow = (i) => {
    const next = rows.filter((_, idx) => idx !== i)
    const ensured = next.length ? next : [{ ...emptyRow }]
    setRows(ensured)
    validate(ensured)
    emit(ensured)
  }

  return (
    <div>
      {rows.map((r, i) => (
        <div key={i}>
          <input
            type='text'
            placeholder='Ingredient'
            value={r.ingredient}
            onChange={(e) => handleChange(i, 'ingredient', e.target.value)}
          />
          <input
            type='number'
            placeholder='Quantity'
            value={r.amountQuantity}
            onChange={(e) => handleChange(i, 'amountQuantity', e.target.value)}
          />
          <input
            type='text'
            placeholder='Measurement'
            value={r.amountUnit}
            onChange={(e) => handleChange(i, 'amountUnit', e.target.value)}
          />
          <button type='button' onClick={() => removeRow(i)}>
            -
          </button>
          {i === rows.length - 1 && (
            <button type='button' onClick={addRow}>
              +
            </button>
          )}
          {errors[i] && <div>Fill all three fields or clear them.</div>}
        </div>
      ))}
    </div>
  )
}

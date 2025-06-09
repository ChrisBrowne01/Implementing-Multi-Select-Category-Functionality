import React from 'react'

export const FilterForm = ({search, setSearch}) => {
  return (
    <div>
      <form className="filter-input">
        <input
          placeholder="Search by Job"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </form>
    </div>
  )
}


import { useState } from 'react'

const Home = () => {
  const [id, setId] = useState(0)

  return (
    <>
      <button
        onClick={async () => {
          const res = await fetch('/api/getArcacon?id=3351')
          const url = window.URL.createObjectURL(
            new Blob([await res.arrayBuffer()], { type: 'application/zip' }),
          )
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${id}.zip`)
          document.body.appendChild(link)
          link.click()
          link.remove()
        }}
      >
        hi
      </button>
      <input />
    </>
  )
}

export default Home

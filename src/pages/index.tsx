import { useState } from 'react'
import { css } from '~/styled-system/css'
import { Box, Flex } from '~/styled-system/jsx'

const Home = () => {
  const [id, setId] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Flex direction="column" padding={'20px'} gap={4}>
      <p
        className={css({
          fontSize: 20,
          fontWeight: 'bold',
          lineHeight: 1.5,
        })}
      >
        아카콘 다운로더
      </p>
      <p className={css({ fontSize: 16, lineHeight: 1.5 })}>
        사용방법: 다운받고 싶은 아카콘을 들어간다.
        <br />
        주소창에 arca.live/e/숫자?... 이렇게 되어있는데 숫자만 복사한다.
        <br />
        그리고 숫자를 아래 입력창에 넣고 다운로드 버튼을 누른다.
      </p>
      <Flex gap={4}>
        <input
          className={css({
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 2,
            width: 100,
            fontSize: 16,
          })}
          value={id}
          onChange={e => setId(Number(e.target.value))}
        />
        <button
          className={css({
            background: '#000',
            color: '#fff',
            border: '1px solid #000',
            borderRadius: 4,
            padding: '6px 12px',
            cursor: 'pointer',
          })}
          onClick={async () => {
            setIsLoading(true)
            const res = await fetch(`/api/getArcacon?id=${id}`)
            const url = window.URL.createObjectURL(
              new Blob([await res.arrayBuffer()], {
                type: 'application/zip',
              }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${id}.zip`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            setIsLoading(false)
          }}
        >
          다운로드
        </button>
      </Flex>
    </Flex>
  )
}

export default Home

import { useRef } from 'react'

export function FileInput({ accept = '*', onChange: _onChange }) {
  const inputRef = useRef()
  const onChange = async (event) => {
    const input = inputRef.current
    // console.log('event', input, event)
    // this.readFile(event)
    // event.target.value = null;
    // console.log(input.files)
    const file = input.files[0]
    if (!file) {
      return
    }
    // console.log('file', file)
    const contents = await readFile(file)
    // console.log('contents', contents)
    _onChange(contents)
  }
  return <input ref={inputRef} type="file" accept={accept} onChange={onChange} />
}

async function readFile(file) {
  return Promise.resolve(URL.createObjectURL(file))
  /*
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
  */
}

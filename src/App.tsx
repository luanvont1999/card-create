import { useEffect, useState } from 'react'
import './App.css'
import { init, update } from './script'

function App() {

  const [form, setForm] = useState({
    name: '',
    title: '',
    image: undefined as HTMLImageElement | undefined
  })

  useEffect(() => {
    init()


  }, [])

  useEffect(() => {
    update(form.name, form.title, form.image)
  }, [form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target?.result) return
      const img = new Image()
      img.src = e.target.result as string
      setForm({ ...form, image: img })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className='wrapper'>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <input type="text" placeholder='Name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input type="text" placeholder='Title' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <canvas id='main' width={700} height={900} />
    </div>
  )
}

export default App

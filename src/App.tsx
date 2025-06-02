import { useEffect, useState } from 'react'
import './App.css'
import { init, saveCanvasToJPG, update } from './script'

function App() {

  const [form, setForm] = useState({
    name: '',
    title: '',
    image: undefined as HTMLImageElement | undefined,
    description: '',
    stats: [
      { name: 'Health', value: 100},
      { name: 'Health', value: 100},
      { name: 'Health', value: 100},
      { name: 'Health', value: 100},
      { name: 'Health', value: 100},
    ],
    preview: false
  })

  useEffect(() => {
    init()


  }, [])

  useEffect(() => {
    update(form.name, form.title, form.image, form.description, form.stats, form.preview)
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
      <canvas id='main' width={700} height={900} />

      <div className='form'>
        <label>Background:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <label>Name:</label>
        <input type="text" placeholder='Name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        
        <label>Title:</label>
        <input type="text" placeholder='Title' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        
        <label>Description:</label>
        <textarea placeholder='Description' value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <h3>Stats</h3>

        {form.stats.map((stat, index) => (
          <div key={index} className='stat'>
            <input type="text" placeholder={stat.name} value={stat.name} onChange={(e) => setForm({ ...form, stats: form.stats.map((s, i) => i === index ? { ...s, name: e.target.value } : s) })} />
            <input type="number" placeholder={stat.name} value={stat.value} onChange={(e) => setForm({ ...form, stats: form.stats.map((s, i) => i === index ? { ...s, value: Number(e.target.value) } : s) })} />
          </div>
        ))}

        <label>Preview:</label>
        <input type="checkbox" checked={form.preview} onChange={(e) => setForm({ ...form, preview: e.target.checked })} />

        <button onClick={saveCanvasToJPG}>Save</button>

      </div>
    </div>
  )
}

export default App

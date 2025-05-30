let CANVAS : HTMLCanvasElement | undefined = undefined

const position: { x: number, y: number } = { x: 0, y: 0 }
let isDragging = false
let lastMousePosition = { x: 0, y: 0 }
let scale = 1

let name = 'Nguyen Van A'
let title = 'Navigator'

const cardFrame = new Image()
cardFrame.src = './card-frame.png'

let background = new Image()
background.src = './background.jpg'

export const init = () => {
  CANVAS = document.getElementById('main') as HTMLCanvasElement
  if (!CANVAS) {
    throw new Error('Canvas not found')
  }

  CANVAS.addEventListener('mousedown', handleMouseDown)
  CANVAS.addEventListener('mousemove', handleMouseMove)
  CANVAS.addEventListener('mouseup', handleMouseUp)
  CANVAS.addEventListener('mouseleave', handleMouseUp)
  CANVAS.addEventListener('wheel', handleWheel)

  requestAnimationFrame(loop)
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  
  // Tính toán tỷ lệ zoom dựa trên hướng scroll
  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
  
  // Giới hạn scale trong khoảng 0.1 đến 5
  const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 5)
  
  // Tính toán vị trí chuột tương đối với canvas
  const rect = CANVAS!.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  // Điều chỉnh vị trí để zoom từ vị trí chuột
  position.x = mouseX - (mouseX - position.x) * (newScale / scale)
  position.y = mouseY - (mouseY - position.y) * (newScale / scale)
  
  scale = newScale
}

const handleMouseDown = (e: MouseEvent) => {
  isDragging = true
  lastMousePosition = { x: e.clientX, y: e.clientY }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging) return

  const deltaX = e.clientX - lastMousePosition.x
  const deltaY = e.clientY - lastMousePosition.y

  position.x += deltaX
  position.y += deltaY

  lastMousePosition = { x: e.clientX, y: e.clientY }
}

const handleMouseUp = () => {
  isDragging = false
}

const loop = () => {
  if (!CANVAS) {
    throw new Error('Canvas not found')
  }

  const ctx = CANVAS.getContext('2d')
  if (!ctx) {
    throw new Error('Context not found')
  }

  ctx.save()
  ctx.clearRect(0, 0, CANVAS.width, CANVAS.height)

  // Vẽ background với scale
  if (background) {
    const scaledWidth = background.width * scale
    const scaledHeight = background.height * scale
    ctx.drawImage(background, position.x, position.y, scaledWidth, scaledHeight)
  }

  ctx.drawImage(cardFrame, 0, 0, cardFrame.width, cardFrame.height, 50, 50, 600, 800)

  ctx.font = 'bold 24px Arial'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText(name, 500, 505)

  ctx.font = 'bold 30px Arial'
  ctx.translate(100 ,600)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(title, 0, 0)
  ctx.rotate(Math.PI / 2)
  ctx.translate(-500, -500)

  ctx.restore()

  requestAnimationFrame(loop)
}

export const update = (_name: string, _title: string, _image: HTMLImageElement | undefined) => {
  name = _name
  title = _title
  if (_image) {
    background = _image
  }
}

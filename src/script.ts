let CANVAS: HTMLCanvasElement | undefined = undefined

const position: { x: number; y: number } = { x: 0, y: 0 }
let isDragging = false
let lastMousePosition = { x: 0, y: 0 }
let scale = 1

let name = "Nguyen Van A"
let title = "Navigator"
let description = "Description"
let stats: { name: string; value: number }[] = [
  { name: "Health", value: 100 },
  { name: "Health", value: 100 },
  { name: "Health", value: 100 },
  { name: "Health", value: 100 },
  { name: "Health", value: 100 },
]
let preview = false

const cardFrame = new Image()
cardFrame.src = "./card-frame.png"

let background = new Image()
background.src = "./background.jpg"

export const init = () => {
  CANVAS = document.getElementById("main") as HTMLCanvasElement
  if (!CANVAS) {
    throw new Error("Canvas not found")
  }

  CANVAS.addEventListener("mousedown", handleMouseDown)
  CANVAS.addEventListener("mousemove", handleMouseMove)
  CANVAS.addEventListener("mouseup", handleMouseUp)
  CANVAS.addEventListener("mouseleave", handleMouseUp)
  CANVAS.addEventListener("wheel", handleWheel)

  requestAnimationFrame(loop)
}

const handleWheel = (e: WheelEvent) => {
  if (preview) return
  
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
  if (preview) return
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
    throw new Error("Canvas not found")
  }

  const ctx = CANVAS.getContext("2d")
  if (!ctx) {
    throw new Error("Context not found")
  }

  ctx.save()
  ctx.clearRect(0, 0, CANVAS.width, CANVAS.height)

  // Vẽ background với scale
  if (background) {
    const scaledWidth = background.width * scale
    const scaledHeight = background.height * scale

    if (preview) {
      // Tạo clipping path cho card frame
      ctx.beginPath()
      ctx.rect(50, 50, 600, 800)
      ctx.clip()
      
      ctx.drawImage(
        background,
        position.x,
        position.y,
        scaledWidth,
        scaledHeight
      )
      
      // Reset clip
      ctx.restore()
      ctx.save()
    } else {
      ctx.drawImage(
        background,
        position.x,
        position.y,
        scaledWidth,
        scaledHeight
      )
    }
  }

  ctx.drawImage(
    cardFrame,
    0,
    0,
    cardFrame.width,
    cardFrame.height,
    50,
    50,
    600,
    800
  )

  ctx.font = "bold 24px Arial"
  ctx.fillStyle = "white"
  ctx.textAlign = "center"
  ctx.fillText(name, 500, 505)

  ctx.font = "bold 30px Arial"
  ctx.translate(100, 600)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(title, 0, 0)
  ctx.rotate(Math.PI / 2)
  ctx.translate(-500, -500)

  ctx.restore()

  // Vẽ Description
  ctx.textAlign = "left"
  ctx.font = "semibold 15px Arial"
  ctx.fillStyle = "white"
  wrapText(ctx, description, 370, 210, 250, 20)

  // Vẽ radar chart
  const centerX = 490
  const centerY = 670
  const radius = 100

  // Dữ liệu cho radar chart
  const statsValues = stats.map((stat) => stat.value)
  const labels = stats.map((stat) => stat.name)
  const sides = stats.length
  const angleStep = (Math.PI * 2) / sides

  // Vẽ các đường nối tâm đến đỉnh
  ctx.beginPath()
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep - Math.PI / 2
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle)
    )
  }
  ctx.strokeStyle = "rgba(255,255,255,0.3)"
  ctx.stroke()

  // Vẽ các đa giác đồng tâm
  for (let r = 0.2; r <= 1; r += 0.2) {
    ctx.beginPath()
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + radius * r * Math.cos(angle)
      const y = centerY + radius * r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = "rgba(255,255,255,0.3)"
    ctx.stroke()
  }

  // Vẽ dữ liệu
  ctx.beginPath()
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep - Math.PI / 2
    const value = statsValues[i] / 100
    const x = centerX + radius * value * Math.cos(angle)
    const y = centerY + radius * value * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = "rgba(255, 99, 132, 0.2)"
  ctx.fill()
  ctx.strokeStyle = "rgb(255, 99, 132)"
  ctx.stroke()

  // Vẽ các điểm
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep - Math.PI / 2
    const value = statsValues[i] / 100
    const x = centerX + radius * value * Math.cos(angle)
    const y = centerY + radius * value * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = "rgb(255, 99, 132)"
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.stroke()
  }

  // Vẽ labels
  ctx.font = "bold 12px Arial"
  ctx.fillStyle = "white"
  ctx.textAlign = "center"
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + (radius + 20) * Math.cos(angle)
    const y = centerY + (radius + 20) * Math.sin(angle)
    ctx.fillText(labels[i], x, y)
  }

  requestAnimationFrame(loop)
}

export const update = (
  _name: string,
  _title: string,
  _image: HTMLImageElement | undefined,
  _description: string,
  _stats: { name: string; value: number }[],
  _preview: boolean
) => {
  name = _name
  title = _title
  description = _description
  stats = _stats
  preview = _preview
  if (_image) {
    background = _image
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  // Tách văn bản thành các từ
  const words = text.split(" ")
  let line = ""
  let testLine = ""
  const lines: string[] = []

  // Kiểm tra độ rộng của từng dòng và tách thành nhiều dòng nếu cần
  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + " "
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && n > 0) {
      lines.push(line)
      line = words[n] + " "
    } else {
      line = testLine
    }
  }
  lines.push(line)

  // Vẽ từng dòng văn bản
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight)
  }
}
export const saveCanvasToJPG = () => {
  if (!CANVAS) return

  // Tạo canvas tạm thời để lưu vùng card frame
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = 700 // Chiều rộng của card frame
  tempCanvas.height = 900 // Chiều cao của card frame

  const tempCtx = tempCanvas.getContext("2d")
  if (!tempCtx) return

  // Vẽ nội dung từ canvas chính sang canvas tạm
  tempCtx.drawImage(CANVAS, 0, 0)

  // Tạo link tải ảnh
  const link = document.createElement("a")
  link.download = "card.jpg"
  link.href = tempCanvas.toDataURL("image/jpeg", 0.8)

  // Click tự động để tải ảnh
  link.click()
}

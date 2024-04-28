/// <reference types="chrome"/>

const div = document.createElement('div')
div.style.position = 'fixed'
div.style.transform = 'translateX(100%)'
div.style.transition = 'transform 0.5s'
div.style.zIndex = '1500'
div.style.height = '100vh'
div.style.right = '0'
div.style.top = '0'

const button = document.createElement('div')
button.style.width = '60px'
button.style.height = '35px'
button.style.cursor = 'pointer'
button.style.borderRadius = '8px'
button.style.lineHeight = '35px'
button.style.textAlign = 'center'
button.style.color = '#fff'
button.style.backgroundColor = '#fb7299'
button.style.fontSize = '14px'
button.style.fontWeight = '500'
button.style.fontFamily =
  '-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif'
button.style.position = 'absolute'
button.style.left = '0'
button.style.top = '50%'
button.style.transform = 'translateX(-100%) translateY(-50%)'
button.innerText = '评论'
button.addEventListener('click', () => {
  const insetApp = document.getElementById('insetApp')
  if (insetApp) {
    if (div.style.transform === 'translateX(100%)') {
      // document.body.style.overflowY = 'hidden'
      div.style.transform = ''
    } else if (div.style.transform === '') {
      // document.body.style.overflowY = 'scroll'
      div.style.transform = 'translateX(100%)'
    }
  }
})

const app = document.createElement('div')
app.id = 'insetApp'
app.style.height = '100vh'
app.style.backgroundColor = '#fff'
app.style.overflowY = 'scroll'
// 设置阴影，让分隔更明显
app.style.boxShadow = '0 10px 10px -5px rgba(0, 0, 0)'

div.append(button)
div.append(app)
// const div = <div style="width:'600px'"></div>
// document.getElementsByTagName('body')[0].append(div)
document.body.append(div)

const cssPath = ['App.css', 'vendor.css']
cssPath.forEach((item: string) => {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', chrome.extension.getURL(item))
  document.body.append(link)
})

const script = document.createElement('script')
script.setAttribute('type', 'module')
script.src = chrome.extension.getURL('main.js')
document.body.append(script)

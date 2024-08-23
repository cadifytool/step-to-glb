export function download(url, filename) {
  // var btn = document.createElement('button');
  // document.body.appendChild(btn);
  // btn.textContent = 'Download .glb';
  // btn.onclick = download;
  const link = document.createElement('a')
  link.style.display = 'none'
  // document.body.appendChild(link); // Firefox workaround, see #6594
  link.href = url
  link.download = filename
  link.click()

  // URL.revokeObjectURL( url ); breaks Firefox...
}

let timeout = null

function debounce(fn, wait) {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
}
export { debounce }
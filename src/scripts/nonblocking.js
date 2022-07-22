function onLoad() {
  //
  // Nav bar that follows you
  //

  /** @type {HTMLElement | null} */
  const navbar = document.querySelector('#nav-bar')
  /** @type {HTMLElement | null} */
  const firstSection = document.querySelector('main')

  if (!navbar || !firstSection) {
    console.error('Unable to find nav bar or content start!')
    return
  }

  const stickyPos = firstSection.offsetTop - navbar.clientHeight // Offset a bit in case something goes wrong

  //console.debug('Main content starts:', firstSection.offsetTop, 'Nav bar height:', navbar.clientHeight, 'Sticky pos:', stickyPos)

  const onScroll = () => {
    //console.debug('Current pos:', window.pageYOffset)
    if (window.pageYOffset >= stickyPos) {
      navbar.classList.add('sticky')
      navbar.classList.remove('position-absolute')
    }
    else {
      navbar.classList.add('position-absolute')
      navbar.classList.remove('sticky')
    }
  }

  window.addEventListener('scroll', onScroll)

  // Make sure the bar appears on refresh.
  onScroll()
}

document.readyState === 'complete' ? onLoad() : window.addEventListener('load', onLoad)

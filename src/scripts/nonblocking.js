function onLoad() {
  //
  // Nav bar that follows you
  //

  /** @type {HTMLElement | null} */
  const navbar = document.querySelector('#nav-bar')
  /** @type {HTMLElement | null} */
  const firstAnchor = document.querySelector('#me')

  if (!navbar || !firstAnchor) {
    console.error('Unable to find nav bar or content start!')
    return
  }

  const onScroll = () => {
    // Offset a bit to account some mobile devices.
    const stickyPos = firstAnchor.offsetTop - 1
    //console.debug('Main content starts:', firstAnchor.offsetTop, 'Sticky pos:', stickyPos, 'Current pos:', window.scrollY)

    if (window.scrollY >= stickyPos) {
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

/**
 * Function for creating the double-click effect on navbar to go to homepage
 * @param {HTMLElement} element - What element should be clicked
 * @param {callback} callback - What you want to do when element has been clicked twice
 */
function activateDoubleClick(element, callback) {
  let clickedOnce = false;
  let clickedTwice = false;
  let timer;

  element.onclick = e => {
    const mouseX = e.x;
    const mouseY = e.y;
    const notification = document.createElement('span');

    if (!clickedTwice) {
      notification.textContent = '+1';

      notification.classList.add('notification-marker');

      notification.style = `top: ${mouseY +
        (Math.random() > 0.5
          ? Math.floor(Math.random() * 21)
          : -Math.floor(Math.random() * 21))}px;left: ${mouseX +
        (Math.random() > 0.5
          ? Math.floor(Math.random() * 21)
          : -Math.floor(Math.random() * 21))}px`;

      element.appendChild(notification);

      notification.addEventListener('animationend', function() {
        element.removeChild(this);
      });
    }

    timer = setTimeout(() => {
      clickedOnce = false;
      clickedTwice = false;

      notification.textContent = '+1';
    }, 600);

    if (clickedOnce) {
      notification.textContent = '+2';
      clickedTwice = true;

      setTimeout(() => {
        callback();
      }, 150);

      // HAVE TO FIX THIS CLEARTIMEOUT, IT'S NOT WORKING
      clearTimeout(timer);
    }

    clickedOnce = true;
  };
}

export default activateDoubleClick;

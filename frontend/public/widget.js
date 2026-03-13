(function() {
  const SCRIPT_URL = document.currentScript.src;
  const BASE_URL = new URL(SCRIPT_URL).origin;
  
  // Create widget container
  const container = document.createElement('div');
  container.id = 'ai-chatbot-widget-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  container.style.fontFamily = 'Inter, sans-serif';
  
  // Create button
  const button = document.createElement('button');
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
    </svg>
  `;
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.borderRadius = '30px';
  button.style.backgroundColor = '#0f172a';
  button.style.color = '#ffffff';
  button.style.border = 'none';
  button.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  button.style.cursor = 'pointer';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.transition = 'transform 0.2s';
  
  button.onmouseover = () => button.style.transform = 'scale(1.1)';
  button.onmouseout = () => button.style.transform = 'scale(1)';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `${BASE_URL}/chat-embed`; // Optimized route for widget
  iframe.style.position = 'absolute';
  iframe.style.bottom = '80px';
  iframe.style.right = '0';
  iframe.style.width = '400px';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '20px';
  iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
  iframe.style.display = 'none';
  iframe.style.transition = 'opacity 0.3s, transform 0.3s';
  iframe.style.opacity = '0';
  iframe.style.transform = 'translateY(20px)';
  
  let isOpen = false;
  
  button.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.display = 'block';
      setTimeout(() => {
        iframe.style.opacity = '1';
        iframe.style.transform = 'translateY(0)';
      }, 10);
    } else {
      iframe.style.opacity = '0';
      iframe.style.transform = 'translateY(20px)';
      setTimeout(() => {
        iframe.style.display = 'none';
      }, 300);
    }
  };
  
  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);

  // Responsive for mobile
  const mediaQuery = window.matchMedia('(max-width: 480px)');
  function handleMobile(e) {
    if (e.matches) {
      iframe.style.width = 'calc(100vw - 40px)';
      iframe.style.height = 'calc(100vh - 120px)';
    } else {
      iframe.style.width = '400px';
      iframe.style.height = '600px';
    }
  }
  mediaQuery.addListener(handleMobile);
  handleMobile(mediaQuery);
})();

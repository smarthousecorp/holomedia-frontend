// preventDevTools.ts
export const preventDevTools = () => {
    // 1. 키보드 단축키 비활성화
    document.addEventListener('keydown', (e) => {
      // Windows: Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + Shift + C, F12
      // Mac: Cmd + Option + I, Cmd + Option + J, Cmd + Option + C
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    });
  
    // 2. 우클릭 메뉴 비활성화
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  
    // 3. 개발자 도구 감지
    const devToolsCheck = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
      if (widthThreshold || heightThreshold) {
        window.location.href = '/dev-tools-alert';
      }
    };
  
    setInterval(devToolsCheck, 1000);
  
    // 4. console.* 메서드 덮어쓰기
    const disableConsole = () => {
        const noop = () => undefined;
        type ConsoleMethod = keyof Console;
        const methods: ConsoleMethod[] = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];

        methods.forEach((method) => {
            (console[method] as any) = noop;
        });
    };
  
    disableConsole();
  };
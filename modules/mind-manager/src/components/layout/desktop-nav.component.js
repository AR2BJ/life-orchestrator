export const DesktopNavComponent = {
  render() {
    return `
      <div
        id="desktop-nav"
        class="hidden lg:flex fixed left-5 top-5 bottom-5 w-20 flex-col justify-between items-center bg-surface backdrop-blur-xl shadow-sm border border-border rounded-2xl py-4 z-50 transition-all duration-300 -translate-x-[calc(100%+2rem)]"
      >
        <div class="flex flex-col items-center gap-6 w-full px-3">
          <div class="w-13.5 h-13.5 flex flex-row justify-center items-center">
            <a
              href="/mind-manager"
              class="w-13.5 h-13.5 flex flex-row justify-center items-center"
            >
              <img
                id="logo"
                src="/modules/mind-manager/public/picture/logo.png"
                class="logo w-13.5 h-13.5 justify-center shadow-brand/10"
                title="Mind Manager"
                alt="Mind Manager Logo"
              />
            </a>
          </div>

          <div class="separator w-3/4 h-px border-b border-border"></div>

          <button
            id="nav-mind"
            class="nav-item justify-center shadow-brand/10"
            title="Mind"
          >
            <i class="ti ti-brain text-2xl"></i>
          </button>

          <button
            id="nav-analytics"
            class="nav-item justify-center"
            title="Analytics"
          >
            <i class="ti ti-chart-line text-2xl"></i>
          </button>
        </div>

        <div class="w-full px-3">
          <button
            id="nav-settings"
            class="nav-item justify-center"
            title="Settings"
          >
            <i class="ti ti-settings text-2xl"></i>
          </button>
        </div>
      </div>
    `;
  },
};

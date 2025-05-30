const DownloadSection = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="section-title mb-10 text-center p-1">
          <h2 className="text-xl md:text-2xl font-bold">TẢI GAME</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="app-button relative group">
            <a
              href=" https://drive.google.com/file/d/1iOLu57CFqGKkNeoMP8qWL76LpteR5dW-/view?usp=drive_link"
              className="download-btn block w-64 h-16 bg-no-repeat bg-contain bg-center relative transform group-hover:scale-105 transition-transform"
              target="_blank"
              rel="noopener noreferrer"

            >
              <span className="absolute inset-0 " >
                <img
                  src="https://ext.same-assets.com/2307704348/2719285420.png"
                  alt="Download"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1)' }}
                />
              </span>
              <div className="absolute inset-0 flex items-center px-3 z-10">
                <div className="flex items-center justify-center w-10 h-10 ml-1">
                  <img
                    src="/images/icons/app_store.png"
                    alt="App Store"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex-grow text-center">
                  <span className="text-black font-bold text-lg text-shadow-sm">
                    MACOS
                  </span>
                </div>
                <div className="px-1.5 py-0.5 rounded text-xs font-semibold text-black/80 mr-1">
                  v0.0.1
                </div>
              </div>
            </a>
          </div>
          <div className="app-button relative group">
            <a
              href="https://drive.google.com/file/d/1iebwOMUOwUCO3ZDHsmo5qtSXZECKq10A/view?usp=sharing"
              className="download-btn block w-64 h-16 bg-no-repeat bg-contain bg-center relative transform group-hover:scale-105 transition-transform"
              target="_blank"
              rel="noopener noreferrer"

            >
              <span className="absolute inset-0 " >
                <img
                  src="https://ext.same-assets.com/2307704348/2719285420.png"
                  alt="Download"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1)' }}
                />
              </span>
              <div className="absolute inset-0 flex items-center px-3 z-10">
                <div className="flex items-center justify-center w-10 h-10 ml-1">
                  <img
                    src="/images/icons/android.png"
                    alt="Android"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex-grow text-center">
                  <span className="text-black font-bold text-lg text-shadow-sm">
                    Android
                  </span>
                </div>
                <div className="px-1.5 py-0.5 rounded text-xs font-semibold text-black/80 mr-1">
                  v0.0.1
                </div>
              </div>
            </a>
          </div>
          <div className="app-button relative group">
            <a
              href=" https://drive.google.com/file/d/1wiyb_B5PyVKEAOM2UoTaGBZshDsZKINA/view?usp=drive_link"
              className="download-btn block w-64 h-16 bg-no-repeat bg-contain bg-center relative transform group-hover:scale-105 transition-transform"
              target="_blank"
              rel="noopener noreferrer"

            >
              <span className="absolute inset-0 " >
                <img
                  src="https://ext.same-assets.com/2307704348/2719285420.png"
                  alt="Download"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1)' }}
                />
              </span>
              <div className="absolute inset-0 flex items-center px-3 z-10">
                <div className="flex items-center justify-center w-10 h-10 ml-1">
                  <img
                    src="/images/icons/windows.png"
                    alt="Windows"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex-grow text-center">
                  <span className="text-black font-bold text-lg text-shadow-sm">
                    Windows
                  </span>
                </div>
                <div className="px-1.5 py-0.5 rounded text-xs font-semibold text-black/80 mr-1">
                  v0.0.1
                </div>
              </div>
            </a>
          </div>
          <div className="app-button relative group">
            <a
              href="https://drive.google.com/file/d/1iebwOMUOwUCO3ZDHsmo5qtSXZECKq10A/view?usp=sharing"
              className="download-btn block w-64 h-16 bg-no-repeat bg-contain bg-center relative transform group-hover:scale-105 transition-transform"
              target="_blank"
              rel="noopener noreferrer"

            >
              <span className="absolute inset-0 " >
                <img
                  src="https://ext.same-assets.com/2307704348/2719285420.png"
                  alt="Download"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1)' }}
                />
              </span>
              <div className="absolute inset-0 flex items-center px-3 z-10">
                <div className="flex items-center justify-center w-10 h-10 ml-1">
                  <img
                    src="/images/icons/android.png"
                    alt="App Store"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex-grow text-center">
                  <span className="text-black font-bold text-lg text-shadow-sm">
                    Google Play
                  </span>
                </div>
                <div className="px-1.5 py-0.5 rounded text-xs font-semibold text-black/80 mr-1">
                  v0.0.1
                </div>
              </div>
            </a>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;

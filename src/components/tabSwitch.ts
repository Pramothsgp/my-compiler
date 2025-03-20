import { useEffect, useState } from "react";

const usePreventReload = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r") || (event.metaKey && event.key === "r")) {
        event.preventDefault();
        alert("Reload is disabled!");
      }
    };

    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleRightClick); // Disable right-click

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);
};

const useTabSwitchCounter = () => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastSwitchTime, setLastSwitchTime] = useState<string | null>(null);

  useEffect(() => {
    const handleSwitch = () => {
      if (document.hidden || !document.hasFocus()) {
        setTabSwitchCount((prevCount) => prevCount + 1);
        setLastSwitchTime(new Date().toLocaleTimeString());
      }
    };

    document.addEventListener("visibilitychange", handleSwitch);
    window.addEventListener("blur", handleSwitch);

    return () => {
      document.removeEventListener("visibilitychange", handleSwitch);
      window.removeEventListener("blur", handleSwitch);
    };
  }, []);

  return { tabSwitchCount, lastSwitchTime };
};

const useEnforceFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().catch((err) => console.error("Error entering fullscreen:", err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setTimeout(() => {
        enterFullscreen();
      }, 500);
    }
  }, [isFullscreen]);

  return { isFullscreen, enterFullscreen };
};

export { usePreventReload, useTabSwitchCounter, useEnforceFullscreen };

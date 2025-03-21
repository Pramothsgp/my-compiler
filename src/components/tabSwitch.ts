import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const usePreventReload = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "F5" || 
        (event.ctrlKey && (event.key === "r" || event.key === "Shift" || event.key === "i" || event.key === "j" || event.key === "c" || event.key === 'v')) || 
        (event.metaKey && (event.key === "r" || event.key === "Shift" || event.key === "i" || event.key === "j" || event.key === "c" || event.key === 'v')) || 
        event.key === "F12"
      ) {
        event.preventDefault();
        toast.error("This action is disabled!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    };

    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
    };

    const detectDevTools = () => {
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          toast.error("DevTools detected! This action is disabled!",{
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        },
      });
      console.log(element);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleRightClick); // Disable right-click
    window.addEventListener("devtoolschange", detectDevTools);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleRightClick);
      window.removeEventListener("devtoolschange", detectDevTools);
    };
  }, []);
};


const useTabSwitchCounter = () => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastSwitchTime, setLastSwitchTime] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleSwitch = () => {
      if (document.hidden || !document.hasFocus()) {
        if (!isHidden) {
          setTabSwitchCount((prevCount) => prevCount + 1);
          setLastSwitchTime(new Date().toLocaleTimeString());
          setIsHidden(true);
        }
      } else {
        setIsHidden(false);
      }
    };

    document.addEventListener("visibilitychange", handleSwitch);
    window.addEventListener("blur", handleSwitch);
    window.addEventListener("focus", handleSwitch);

    return () => {
      document.removeEventListener("visibilitychange", handleSwitch);
      window.removeEventListener("blur", handleSwitch);
      window.removeEventListener("focus", handleSwitch);
    };
  }, [isHidden]);

  const resetTabSwitchCount = () => {
    setTabSwitchCount(0);
    setLastSwitchTime(null);
  };

  return { tabSwitchCount, lastSwitchTime, resetTabSwitchCount };
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

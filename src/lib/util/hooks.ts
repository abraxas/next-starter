import { useState } from "react";

export function useToggle(defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);
  function toggle() {
    setValue(!value);
  }
  function enable() {
    setValue(true);
  }
  function disable() {
    setValue(false);
  }

  return { value, toggle, enable, disable } as const;
}

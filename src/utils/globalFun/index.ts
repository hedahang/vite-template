export * from "./operate";

export const openLink = (link: string) => {
  const $a: HTMLElement = document.createElement("a");
  $a.setAttribute("href", link);
  $a.setAttribute("target", "_blank");
  $a.setAttribute("rel", "noreferrer noopener");
  $a.setAttribute("id", "external");
  document.getElementById("external") &&
    document.body.removeChild(document.getElementById("external"));
  document.body.appendChild($a);
  $a.click();
  $a.remove();
};

// 延迟函数
export const delay = (timeout: number) =>
  new Promise(resolve => setTimeout(resolve, timeout));

// 防抖函数
export const debounce = (fn: () => Fn, timeout: number) => {
  let timmer: TimeoutHandle;
  return () => {
    timmer ? clearTimeout(timmer) : null;
    timmer = setTimeout(fn, timeout);
  };
};

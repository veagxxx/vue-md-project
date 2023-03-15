import { onBeforeUnmount, onMounted } from "vue"

export const useEventListener = (
  target: Element | Window | HTMLCanvasElement, 
  event: string, 
  callback: any
) => {
  onMounted(() => target.addEventListener(event, callback))
  onBeforeUnmount(() => target.removeEventListener(event, callback))
}

export const usePoint = (event: MouseEvent, el?: Element, scale?: number) => {
  const [x, y]: number[] = [event.pageX, event.pageY];
  if (el && scale) {
    const { left, top } = el.getBoundingClientRect();
    return [(x - left) * scale, (y - top) * scale]
  } else if (el) {
    const { left, top } = el.getBoundingClientRect()
    return [x - left, y - top]
  } else {
    return [x, y]
  }
}
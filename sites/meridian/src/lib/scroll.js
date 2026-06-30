// Shared scroll progress (0..1), written by Lenis in App.jsx and read by the
// particle field every frame. Plain module object so the r3f render loop can
// read it without React re-renders.
export const scrollState = { progress: 0 }

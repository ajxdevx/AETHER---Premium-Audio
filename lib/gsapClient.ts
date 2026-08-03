// Framer owns UI chrome; GSAP is loaded on demand for media morphs and hovers.
let load: Promise<typeof import("gsap")> | null = null;

export function loadGsap() {
  load ??= import("gsap");
  return load.then((module) => module.default);
}
